import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createCampaignValidator from "./validators/createCampaignValidator";
import { Profile } from "../profile";
import advertisementModels, { AdType, AdTypeWithoutRefs, PerformanceType } from "./advertisement.model";
import { serviceModel as Service } from "../service";
import mongoose, { isValidObjectId } from "mongoose";
import { isInvalidBudgetType } from "./validators/inputValidations";
import getValidUpdatedCampaignInputs from "./helpers/getValidUpdatedCampaignInputs";
import calcBudgetAllocation from "./utils/calcBudgetAllocation";
import getDisplayPeriods, { createCampaignAdDisplayPeriods } from "./display_periods/getDisplayPeriods";



//@desc create campaign
//@route POST api/v1/advertisements/campaigns
//@access authentication (freelancers only)
const createCampaign: RequestHandler = async (req: CustomAuthRequest, res) => {
    const input = req.body;

    // check if value inputs
    createCampaignValidator(input);

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "_id stripe.customer_id" });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current profile is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to create campaigns. Freelancers only");
    }

    // check if the freelancer is already a customer (at least created payment method once)
    if (!profile.user!.stripe!.customer_id) {
        throw new BadRequestError("You must set a payment method to start creating campaigns");
    }

    // check if the freelancer doesnt have any unpaid invoices
    if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
        throw new UnauthorizedError("You have unpaid advertisement invoices, please update your payment method");
    }

    // get IDs of the services
    const idServices: mongoose.Types.ObjectId[] = []; // ID services to check later if these are valid IDs and current freelancer have access to them

    const inputAds: (AdTypeWithoutRefs & { service: string })[] = input.ads; // Input ads that has been provided by the freelancer. It desnt incude user ID 

    const ads: (AdTypeWithoutRefs & { service: string; user: mongoose.Types.ObjectId })[] = []; // ads that used to create AD documents. It includes user ID

    // get total bid amount to calc the daily budget allocation for each ad
    const getTotalbidAmount = inputAds.reduce((num, ad) => {
        return ad.bidAmount + num;
    }, 0);

    inputAds.forEach(ad => {
        // push service IDs to check if exist and auhenticated by the freelancer
        idServices.push(new mongoose.Types.ObjectId(ad.service));

        // calc daily budget allocation and push to ads array
        const budgetAllocation = (ad.bidAmount / getTotalbidAmount) * input.budget;

        const displayPeriods = createCampaignAdDisplayPeriods({
            ad: {
                bidAmount: ad.bidAmount,
                budgetAllocation,
                event: ad.event
            },
            campaign: {
                budgetType: input.budgetType,
                endDate: input.endDate,
                startDate: input.startDate
            }
        });


        const startDate = new Date(input.startDate);
        const nextPeriod = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

        ads.push({
            ...ad, user: profile.user._id, budgetAllocation, displayPeriods, nextPeriodGenerationDates: input.budgetType === "daily" ? [nextPeriod] : []
        });
    });

    // find services by id provided and if belongs to the current user
    const services = await Promise.all(
        idServices.map(id => Service.countDocuments({ _id: id, user: profile.user._id, profile: profile._id }))
    );

    // check if all services exists
    const allServicesExists = services.every(service => service === 1);
    if (!allServicesExists) {
        throw new BadRequestError("Invalid provided services");
    }

    // create ads
    const createdAds = await advertisementModels.Ad.insertMany(ads);

    // create the ads performance
    createdAds.forEach(ad => {
        const performace: PerformanceType = {
            ad,
            trackers: [],
            cpmImpressions: 0,
            displayCount: 0,
            clicks: 0,
            orders: 0,
            ctr: 0,
            cr: 0,
            cpc: 0
        }
        advertisementModels.Performance.create(performace);
    });

    // get all campaign details
    const campaignDetails = {
        user: profile.user._id,
        name: input.name,
        budget: input.budget,
        budgetType: input.budgetType,
        startDate: input.startDate,
        endDate: input.endDate,
        ads: createdAds,
        payments: []
    }

    // create campaign
    const campaign = await advertisementModels.Campaign.create(campaignDetails);

    res.status(StatusCodes.CREATED).json({ msg: `New campaign '${campaign.name}' has been created` });
}


//@desc display freelancer's campaigns
//@route GET api/v1/advertisements/campaigns
//@access authentication (freelancers only)
const getCampaigns: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { search, budget_type, budget_range, ads } = req.query;

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current profile is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to these ressources. Freelancers only");
    }

    // pick only freelancer's campaigns
    const match: mongoose.PipelineStage.Match["$match"] = {
        $and: [
            {
                user: profile.user._id
            }
        ]
    }

    // check if freelancer want to search by title
    if (search && search.toString() !== "") {
        match.$and!.push({
            name: { $regex: search, $options: "i" }
        });
    }

    // search by budget type
    const isValidBudgetType = budget_type && !isInvalidBudgetType(budget_type);
    if (isValidBudgetType) {
        match.$and!.push({
            budgetType: budget_type
        });
    }

    // search by budget range (e.g. 5,10)
    const isValidBudgetRage = budget_range && budget_range.toString().trim() !== "" && /^\d+,\d+$/.test(budget_range.toString());
    if (isValidBudgetRage) {
        const [minBudget, maxBudget] = budget_range.toString().split(",");
        if (Number(minBudget) <= Number(maxBudget)) {
            match.$and!.push({
                $and: [
                    { budget: { $gte: Number(minBudget) } },
                    { budget: { $lte: Number(maxBudget) } }
                ]
            });
        }
    }

    const isAllAds = ads && ads.toString() === "all"; // to display campaign metrics for active and inactive ads or just active ads

    // campaign aggregation
    const campaignsAggregation = await advertisementModels.Campaign.aggregate([
        {
            $match: match // get only campaigns based on title, budgetType and budgetRange
        },
        {
            // populate ads documents
            $lookup: {
                from: "ads",
                localField: "ads",
                foreignField: "_id",
                as: "ads"
            }
        },
        {
            // get the campaign's total ads 
            $addFields: {
                totalAds: {
                    $size: "$ads"
                }
            }
        },
        {
            // filter only active ads
            $addFields: {
                activeAds: {
                    $filter: {
                        input: "$ads",
                        as: "ad",
                        cond: {
                            $eq: ["$$ad.status", "active"]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                ads: isAllAds ? "$ads" : "$activeAds" // depends on the ads query, if its all then select active and inactive ads, otherwise select only active ads
            }
        },
        {
            // populate ads performances
            $lookup: {
                from: "performances",
                localField: "ads._id",
                foreignField: "ad",
                as: "performances"
            }
        },
        {
            // add clicks field, where it sum campaign's ads clicks
            $addFields: {
                clicks: {
                    $reduce: {
                        input: "$performances",
                        initialValue: 0,
                        in: {
                            $add: ["$$this.clicks", "$$value"]
                        }
                    }
                }
            }
        },
        {
            // add impressions field, where it sum campaign's ads impressions
            $addFields: {
                impressions: {
                    $reduce: {
                        input: "$performances",
                        initialValue: 0,
                        in: {
                            $add: ["$$this.displayCount", "$$value"]
                        }
                    }
                }
            }
        },
        {
            // add orders field, where it sum campaign's ads orders
            $addFields: {
                orders: {
                    $reduce: {
                        input: "$performances",
                        initialValue: 0,
                        in: {
                            $add: ["$$this.orders", "$$value"]
                        }
                    }
                }
            }
        },
        {
            // add ctr field, where it gets the average of campaign's ads ctr
            $addFields: {
                ctr: {
                    // using $cond to check if displayCount result doesnt equal to 0 to avoid dividing by 0
                    $cond: [
                        {
                            $eq: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$performances",
                                            as: "performance",
                                            cond: {
                                                $ne: ["$$performance.displayCount", 0]
                                            }
                                        }
                                    }
                                },
                                0
                            ]
                        },
                        0, // if its true, then set 0 as a return
                        {
                            $divide: [
                                {
                                    $reduce: {
                                        input: "$performances",
                                        initialValue: 0,
                                        in: {
                                            $add: ["$$this.ctr", "$$value"]
                                        }
                                    }
                                },
                                {
                                    $size: {
                                        $filter: {
                                            input: "$performances",
                                            as: "performance",
                                            cond: {
                                                $ne: ["$$performance.displayCount", 0]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            // add cr field, where it gets the average of campaign's ads cr
            $addFields: {
                cr: {
                    $cond: [
                        // using $cond to check if clicks result doesnt equal to 0 to avoid dividing by 0
                        {
                            $eq: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$performances",
                                            as: "performance",
                                            cond: {
                                                $ne: ["$$performance.clicks", 0]
                                            }
                                        }
                                    }
                                },
                                0
                            ]
                        },
                        0, // if its true, then set 0 as a return
                        {
                            $divide: [
                                {
                                    $reduce: {
                                        input: "$performances",
                                        initialValue: 0,
                                        in: {
                                            $add: ["$$this.cr", "$$value"]
                                        }
                                    }
                                },
                                {
                                    $size: {
                                        $filter: {
                                            input: "$performances",
                                            as: "performance",
                                            cond: {
                                                $ne: ["$$performance.clicks", 0]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            // add cpc field, where it gets the average of campaign's ads cpc
            $addFields: {
                cpc: {
                    // using $cond to check if cpc result doesnt equal to 0 to avoid dividing by 0
                    $cond: [
                        {
                            $eq: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$performances",
                                            as: "performance",
                                            cond: {
                                                $ne: ["$$performance.cpc", 0]
                                            }
                                        }
                                    }
                                },
                                0
                            ]
                        },
                        0, // if its true, then set 0 as a return
                        {
                            $divide: [
                                {
                                    $reduce: {
                                        input: "$performances",
                                        initialValue: 0,
                                        in: {
                                            $add: ["$$this.cpc", "$$value"]
                                        }
                                    }
                                },
                                {
                                    $size: {
                                        $filter: {
                                            input: "$performances",
                                            as: "performance",
                                            cond: {
                                                $ne: ["$$performance.cpc", 0]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            // add amounts array field, where it has campaigns ads amounts object
            $addFields: {
                amounts: {
                    $reduce: {
                        input: "$ads",
                        initialValue: [],
                        in: {
                            $concatArrays: ["$$this.amounts", "$$value"]
                        }
                    }
                }
            }
        },
        {
            // add spend field, where it has the total spend amount on the campaign
            $addFields: {
                spend: {
                    $reduce: {
                        input: "$amounts",
                        initialValue: 0,
                        in: {
                            $add: ["$$this.amount", "$$value"]
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                budget: 1,
                budgetType: 1,
                status: 1,
                startDate: 1,
                endDate: 1,
                createdAt: 1,
                isPaused: 1,
                clicks: 1,
                impressions: 1,
                orders: 1,
                ctr: 1,
                cr: 1,
                cpc: 1,
                spend: 1,
                totalAds: 1,
                activeAds: {
                    $size: "$activeAds"
                },
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    res.status(StatusCodes.OK).json(campaignsAggregation);
}


//@desc get freelancer's campaign details
//@route GET api/v1/advertisements/campaigns/campaignId
//@access authentication (freelancers only)
const getCampaignDetails: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { campaignId } = req.params;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(campaignId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid campaign ID");
    }

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current profile is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to these ressources. Freelancers only");
    }

    // get campaign
    const [campaign] = await advertisementModels.Campaign.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(campaignId),
                user: profile.user // get only the campaign that belongs to the freelancer
            }
        },
        {
            // populate ads documents thats related to this campaign
            $lookup: {
                from: "ads",
                localField: "ads",
                foreignField: "_id",
                as: "ads"
            }
        },
        {
            // populate performances documents thats related to campaign's ads
            $lookup: {
                from: "performances",
                localField: "ads._id",
                foreignField: "ad",
                as: "performances"
            }
        },
        {
            // add ads field, where it merge both ads and performances that are related to each other (ad ID)
            $addFields: {
                ads: {
                    $map: {
                        input: "$ads",
                        as: "ad",
                        in: {
                            $mergeObjects: [
                                "$$ad",
                                {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$performances",
                                                as: "performance",
                                                cond: {
                                                    $eq: ["$$performance.ad", "$$ad._id"]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            // add new field, where it calculate the total spend per ad
            $addFields: {
                ads: {
                    $map: {
                        input: "$ads",
                        as: "ad",
                        in: {
                            $mergeObjects: [
                                "$$ad",
                                {
                                    spend: {
                                        $sum: "$$ad.amounts.amount"
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            // add new field, where it calculate the campaign's total clicks
            $addFields: {
                totalClicks: {
                    $sum: "$ads.clicks"
                }
            }
        },
        {
            // add new field, where it calculate the campaign's total impressions
            $addFields: {
                totalImpressions: {
                    $sum: "$ads.displayCount"
                }
            }
        },
        {
            // add new field, where it calculate the campaign's total orders
            $addFields: {
                totalOrders: {
                    $sum: "$ads.orders"
                }
            }
        },
        {
            // add new field, where it calculate the campaign's total spend
            $addFields: {
                totalSpend: {
                    $sum: "$ads.spend"
                }
            }
        },
        {
            // add new field, where it calculate the campaign's ctr
            $addFields: {
                ctr: {
                    // add $cond to check if totalImpressions is not 0, otherwise dont divide by 0
                    $cond: [
                        { $eq: ["$totalImpressions", 0] },
                        0, // if true then set 0 as a return ctr value
                        {
                            $multiply: [
                                {
                                    $divide: [
                                        "$totalClicks",
                                        "$totalImpressions"
                                    ]
                                }
                                ,
                                100
                            ]
                        }
                    ]
                }
            }
        },
        {
            // add new field, where it calculate the campaign's cr
            $addFields: {
                cr: {
                    // add $cond to check if totalClicks is not 0, otherwise dont divide by 0
                    $cond: [
                        { $eq: ["$totalClicks", 0] },
                        0, // if true then set 0 as a return cr value
                        {
                            $multiply: [
                                {
                                    $divide: [
                                        "$totalOrders",
                                        "$totalClicks"
                                    ]
                                }
                                ,
                                100
                            ]
                        }
                    ]
                }
            }
        },
        {
            // add new field, where it calculate the campaign's cpc
            $addFields: {
                cpc: {
                    // add $cond to check if totalOrders is not 0, otherwise dont divide by 0
                    $cond: [
                        { $eq: ["$totalOrders", 0] },
                        0, // if true then set 0 as a return cpc value
                        {
                            $divide: [
                                "$totalSpend"
                                ,
                                "$totalOrders"
                            ]
                        }
                    ]
                }
            }
        },
        {
            $project: {
                _id: 1,
                status: 1,
                name: 1,
                "ads.service": 1,
                "ads.ad": 1,
                "ads.status": 1,
                "ads.bidAmount": 1,
                "ads.event": 1,
                "ads.category": 1,
                "ads.keywords": 1,
                "ads.country": 1,
                "ads.displayCount": 1,
                "ads.clicks": 1,
                "ads.ctr": 1,
                "ads.cr": 1,
                "ads.cpc": 1,
                "ads.orders": 1,
                "ads.spend": 1,
                "totalClicks": 1,
                "totalImpressions": 1,
                "totalOrders": 1,
                "totalSpend": 1,
                "ctr": 1,
                "cr": 1,
                "cpc": 1
            }
        }
    ]);

    if (!campaign) {
        throw new NotFoundError(`Found no campaign with ID ${campaignId}`);
    }

    res.status(StatusCodes.OK).json(campaign);
}


//@desc update freelancer's campaign
//@route PATCH api/v1/advertisements/campaigns/:campaignId
//@access authentication (freelancers only)
const updateCampaign: RequestHandler = async (req: CustomAuthRequest, res) => {
    const input = req.body;

    const { campaignId } = req.params;

    // check if valid mongodb id
    const isValidCampaignId = isValidObjectId(campaignId);
    if (!isValidCampaignId) {
        throw new BadRequestError("Invalid campaign ID");
    }

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to these ressources. Freelancers only");
    }

    // find campaign
    const campaign = await advertisementModels.Campaign.findById(campaignId).populate({ path: "ads" });
    if (!campaign) {
        throw new BadRequestError(`Found no campaign with ID ${campaignId}`);
    }

    // check if the current freelancer have access to this campaign
    if (campaign.user._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to this campaign");
    }

    // get only the valid inputs
    const validUpdatedCampaignDetails = getValidUpdatedCampaignInputs(input);

    const updatedAds = calcBudgetAllocation({
        ads: campaign.ads.filter(ad => ad.status === "active"),
        campaignBudget: validUpdatedCampaignDetails.budget || campaign.budget
    });

    const update = updatedAds.map(ad => {
        let newDisplayPeriods = ad.displayPeriods!;

        const budgetTypeChanged = validUpdatedCampaignDetails.budgetType && (validUpdatedCampaignDetails.budgetType !== campaign.budgetType);
        const campaignBudgetChanged = validUpdatedCampaignDetails.budget && (validUpdatedCampaignDetails.budget !== campaign.budget);
        const endDateChanged = validUpdatedCampaignDetails.endDate && (validUpdatedCampaignDetails.endDate !== campaign.endDate);

        if (budgetTypeChanged || campaignBudgetChanged || endDateChanged) {
            const displayPeriods = getDisplayPeriods({
                campaignAd: {
                    bidAmount: ad.bidAmount!,
                    budgetAllocation: ad.budgetAllocation!,
                    event: ad.event!,
                    displayPeriods: ad.displayPeriods!
                },
                campaign: {
                    budgetType: validUpdatedCampaignDetails.budgetType || campaign.budgetType,
                    startDate: campaign.startDate,
                    endDate: campaign.endDate
                }
            });

            newDisplayPeriods = displayPeriods
        }

        const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
            updateOne: {
                filter: {
                    _id: ad._id
                },
                update: {
                    $set: {
                        budgetAllocation: ad.budgetAllocation,
                        displayPeriods: newDisplayPeriods
                    }
                }
            }
        }
        return bulkWrite;
    });

    advertisementModels.Ad.bulkWrite(update);

    // update campaign
    await campaign.updateOne(validUpdatedCampaignDetails);

    res.status(StatusCodes.OK).json({ msg: `Campaign '${campaign.name}' has been updated` });
}


//@desc delete freelancer's campaign
//@route DELETE api/v1/advertisements/campaigns/:campaignId
//@access authentication (freelancers only)
const deleteCampaign: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { campaignId } = req.params;

    // check if valid mongodb id
    const isValidCampaignId = isValidObjectId(campaignId);
    if (!isValidCampaignId) {
        throw new BadRequestError("Invalid campaign ID");
    }

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if current user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to delete campaigns. Freelancers only");
    }

    // check if the freelancer doesnt have any unpaid invoices
    if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
        throw new UnauthorizedError("You have unpaid advertisement invoices, please update your payment method");
    }

    // find campaign
    const campaign = await advertisementModels.Campaign.findById(campaignId);
    if (!campaign) {
        throw new BadRequestError(`Found no campaign with ID ${campaignId}`);
    }

    // check if the campaign belongs to the freelancer
    if (campaign.user._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to delete this campaign");
    }

    // delete the campaign
    await campaign.deleteOne();

    res.status(StatusCodes.OK).json({ msg: `Campaign '${campaign.name}' has been deleted` });
}


export {
    createCampaign,
    getCampaigns,
    getCampaignDetails,
    updateCampaign,
    deleteCampaign
}