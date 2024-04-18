import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import advertisementModels, { AdType, PerformanceType } from "./advertisement.model";
import { serviceModel as Service } from "../service";
import mongoose, { isValidObjectId } from "mongoose";
import createAdValidator from "./validators/createAdValidator";
import calcBudgetAllocation from "./utils/calcBudgetAllocation";
import getValidUpdatedAdInputs from "./helpers/getValidUpdatedAdInputs";
import getDisplayPeriods from "./display_periods/getDisplayPeriods";
import getValidAdKeywordInput from "./helpers/getValidAdKeywordInput";
import "./display_periods/generates";



//@desc add an ad to an existing campaign
//@route POST api/v1/advertisements/ads
//@access authentication (freelancers only)
const createAd: RequestHandler = async (req: CustomAuthRequest, res) => {
    const input = req.body;
    const { campaign_id } = req.query;

    // check if campaign id exists
    if (!campaign_id) {
        throw new BadRequestError("Campaign ID is missing");
    }

    // check if valid mongodb id
    const isValidCampaignId = isValidObjectId(campaign_id);
    if (!isValidCampaignId) {
        throw new BadRequestError("Invalid campaign ID");
    }

    // check if valid ad values
    createAdValidator(input);

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to create Ads. Freelancers only");
    }

    // check if the freelancer doesnt have any unpaid invoices
    if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
        throw new UnauthorizedError("You have unpaid advertisement invoices, please update your payment method");
    }

    // find the campaign
    const campaign = await advertisementModels.Campaign.findById(campaign_id.toString()).populate({ path: "ads" });
    if (!campaign) {
        throw new BadRequestError(`Found no campaign with ID ${campaign_id.toString()}`);
    }

    // check if the current user have access to this campaign
    if (campaign.user._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to this campaign");
    }

    // check if the service provided belongs to the current freelancer
    const isExistService = await Service.countDocuments({ _id: input.service, user: profile.user._id });
    if (!isExistService) {
        throw new BadRequestError(`You dont have any service with ID ${input.service}`);
    }

    // check if the campaign ads are not 10 (max ads per campaign is 10)
    if (campaign.ads.length === 10) {
        throw new BadRequestError("You cannot add more than 10 ads");
    }

    const newAd: AdType = {
        service: input.service,
        user: profile.user._id,
        bidAmount: input.bidAmount,
        event: input.event,
        category: input.category,
        keywords: input.keywords.map((keyword: string) => keyword.toLowerCase()),
        displayPeriods: [],
        nextPeriodGenerationDates: [new Date(Date.now() + 24 * 60 * 60 * 1000)], // next 24h
        country: input.country,
        status: "active",
        budgetAllocation: input.bidAmount, // initial budget allocation value
        budgetAllocationSpend: 0,
        budgetAllocationCompleted: false,
        amounts: [],
        orders: []
    }

    // create ad
    const ad = await advertisementModels.Ad.create(newAd);

    // push the ad to the campaign
    campaign.ads.push(ad);
    await campaign.save();

    // create the ad performance
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

    // get the calculated daily budget allocation for each ad
    const ads = calcBudgetAllocation({
        ads: campaign.ads.filter(ad => ad.status === "active"),
        campaignBudget: campaign.budget
    });

    // loop through ads to update their daily budget allocation
    const updates = ads.map(ad => {

        const displayPeriods = getDisplayPeriods({
            campaignAd: {
                bidAmount: ad.bidAmount!,
                budgetAllocation: ad.budgetAllocation!,
                event: ad.event!,
                displayPeriods: ad.displayPeriods!
            },
            campaign: {
                budgetType: campaign.budgetType,
                startDate: campaign.startDate,
                endDate: campaign.endDate,
            }
        });

        const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
            updateOne: {
                filter: {
                    _id: ad._id
                },
                update: {
                    $set: {
                        budgetAllocation: ad.budgetAllocation,
                        displayPeriods
                    }
                }
            }
        }
        return bulkWrite;
    });

    // update daily budget allocation to campaign's ads
    advertisementModels.Ad.bulkWrite(updates);

    res.status(StatusCodes.CREATED).json({ msg: `New ad has been added to '${campaign.name}' campaign` });
}


//@desc update an existing ad
//@route PATCH api/v1/advertisements/ads/adId
//@access authentication (freelancers only)
const updateAd: RequestHandler = async (req: CustomAuthRequest, res) => {
    const input = req.body;
    const { adId } = req.params;

    // check if valid mongodb ID
    const isValidAdId = isValidObjectId(adId);
    if (!isValidAdId) {
        throw new BadRequestError("Invalid ad ID");
    }

    // get valid ad inputs
    const updatedAdDetails = getValidUpdatedAdInputs(input);

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to update ads. Freelancers only");
    }

    // find ad
    const ad = await advertisementModels.Ad.findById(adId);
    if (!ad) {
        throw new BadRequestError(`Found no ad with ID ${adId}`);
    }

    // check if the freelancer have access to this ad
    if (ad.user._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to this ad");
    }

    // check if the updated service belongs to the freelancer if its provided
    if (updatedAdDetails.service && updatedAdDetails.service !== ad.service._id.toString()) {
        const isExists = await Service.findOne({ _id: updatedAdDetails.service, user: profile.user._id });
        if (!isExists) {
            throw new BadRequestError(`You dont have any service with ID ${updatedAdDetails.service}`);
        }
    }

    // update ad
    await ad.updateOne({ $set: updatedAdDetails });

    // update ads display periods and budget allocation
    if ((updatedAdDetails.bidAmount && updatedAdDetails.bidAmount !== ad.bidAmount) || (updatedAdDetails.status && updatedAdDetails.status !== ad.status) || (updatedAdDetails.event && updatedAdDetails.event !== ad.event)) {
        const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id } }).populate({ path: "ads" });
        if (!campaign) {
            throw new BadRequestError(`Found no campaign for this ad`);
        }

        // get the calculated daily budget allocation for each ad
        const updatedAds = calcBudgetAllocation({
            ads: campaign.ads.filter(ad => ad.status === "active"),
            campaignBudget: campaign.budget
        });

        // loop through ads to update their daily budget allocation and display periods
        const updates = updatedAds.map(campaignAd => {

            const displayPeriods = getDisplayPeriods({
                campaignAd: {
                    bidAmount: campaignAd.bidAmount!,
                    budgetAllocation: campaignAd.budgetAllocation!,
                    displayPeriods: campaignAd.displayPeriods!,
                    event: campaignAd._id.toString() === ad._id.toString() ? updatedAdDetails.event || campaignAd.event! : campaignAd.event!
                },
                campaign: {
                    budgetType: campaign.budgetType,
                    startDate: campaign.startDate,
                    endDate: campaign.endDate
                }
            });

            const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
                updateOne: {
                    filter: {
                        _id: campaignAd._id
                    },
                    update: {
                        $set: {
                            budgetAllocation: campaignAd.budgetAllocation,
                            displayPeriods
                        }
                    }
                }
            }

            return bulkWrite;
        });

        // update daily budget allocation to campaign's ads
        advertisementModels.Ad.bulkWrite(updates)
    }

    res.status(StatusCodes.OK).json(updatedAdDetails);
}


//@desc delete ad
//@route DELETE api/v1/advertisements/ads/adId
//@access authentication (freelancers only)
const deleteAd: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { adId } = req.params;

    // check if valid mongodb id 
    const isValidAdId = isValidObjectId(adId);
    if (!isValidAdId) {
        throw new BadRequestError("Invalid ad ID");
    }

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to delete ads. Freelancers only");
    }

    // check if the freelancer doesnt have any unpaid invoices
    if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
        throw new UnauthorizedError("You have unpaid advertisement invoices, please update your payment method");
    }

    // find ad
    const ad = await advertisementModels.Ad.findById(adId);
    if (!ad) {
        throw new BadRequestError(`Found no ad with ID ${adId}`);
    }

    // check if the ad belongs to the freelancer
    if (ad.user._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to delete this ad");
    }

    // find campaign
    const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id.toString() } }).populate({ path: "ads" });
    if (!campaign) {
        throw new BadRequestError("Found no campaign for this ad");
    }

    // do not delete the last ad of the campaign
    if (campaign.ads.length === 1) {
        throw new BadRequestError("You cant delete the last ad of the campaign");
    }

    // delete the ad ID from campaign ads collection
    campaign.ads = campaign.ads.filter(campaignAd => campaignAd._id.toString() !== ad._id.toString());

    // get the calculated daily budget allocation for each ad
    const updatedAds = calcBudgetAllocation({
        ads: campaign.ads.filter(campaignAd => campaignAd.status === "active"),
        campaignBudget: campaign.budget
    });

    // loop through ads to update their daily budget allocation
    const update = updatedAds.map(campaignAd => {

        const displayPeriods = getDisplayPeriods({
            campaignAd: {
                bidAmount: campaignAd.bidAmount!,
                budgetAllocation: campaignAd.budgetAllocation!,
                displayPeriods: campaignAd.displayPeriods!,
                event: campaignAd.event!
            },
            campaign: {
                budgetType: campaign.budgetType,
                startDate: campaign.startDate,
                endDate: campaign.endDate
            }
        });

        const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
            updateOne: {
                filter: {
                    _id: campaignAd._id
                },
                update: {
                    $set: {
                        budgetAllocation: campaignAd.budgetAllocation,
                        displayPeriods
                    }
                }
            }
        }
        return bulkWrite;
    });

    // delete ad
    await ad.deleteOne();

    // update daily budget allocation to campaign's ads
    advertisementModels.Ad.bulkWrite(update);

    campaign.save();

    res.status(StatusCodes.OK).json({ msg: `Ad ID '${adId}' has been deleted` });
}


//@desc display ads
//@route GET api/v1/advertisements/ads
//@access public
const displayAds: RequestHandler = async (req, res) => {
    const query = req.query;

    // seach by category
    const categories = ["digital-marketing", "design-creative", "programming-tech", "writing-translation", "video-animation", "finance-accounting", "music-audio"];
    let category = "";
    if (query.category && categories.includes(query.category.toString())) {
        category = query.category === "digital-marketing" ? query.category.toString().split("-").join(" ") : query.category.toString().split("-").join(" & ");
    }

    // search by pages
    const page = query.page && /^\d+$/.test(query.page.toString()) ? Number(query.page) : 1;

    const ads = await advertisementModels.Campaign.getSponsoredServices({
        keyword: query.keyword?.toString() || "",
        category,
        page
    });

    res.status(StatusCodes.OK).json(ads);
}


export {
    createAd,
    displayAds,
    updateAd,
    deleteAd
}