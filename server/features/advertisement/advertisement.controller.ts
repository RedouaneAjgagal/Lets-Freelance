import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createCampaignValidator from "./validators/createCampaignValidator";
import { Profile } from "../profile";
import advertisementModels, { AdType, AdTypeWithoutRefs } from "./advertisement.model";
import { serviceModel as Service } from "../service";
import mongoose, { isValidObjectId } from "mongoose";
import { isInvalidBudgetType } from "./validators/inputValidations";
import getValidUpdatedCampaignInputs from "./helpers/getValidUpdatedCampaignInputs";
import createAdValidator from "./validators/createAdValidator";
import calcBudgetAllocation from "./utils/calcBudgetAllocation";
import getValidUpdatedAdInputs from "./helpers/getValidUpdatedAdInputs";
import getDisplayPeriods, { generateDisplayPeriods, getDisplayAmount } from "./helpers/getDisplayPeriods";


//@desc create campaign
//@route POST api/v1/advertisements
//@access authentication (freelancers only)
const createCampaign: RequestHandler = async (req: CustomAuthRequest, res) => {
  const input = req.body;

  // check if value inputs
  createCampaignValidator(input);

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the current profile is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to create campaigns. Freelancers only");
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

    const displayPeriods = getDisplayPeriods({
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

    ads.push({
      ...ad, user: profile.user._id, budgetAllocation, displayPeriods
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

  // get all campaign details
  const campaignDetails = {
    user: profile.user._id,
    name: input.name,
    budget: input.budget,
    budgetType: input.budgetType,
    startDate: input.startDate,
    endDate: input.endDate,
    ads: createdAds
  }

  // create campaign
  const campaign = await advertisementModels.Campaign.create(campaignDetails);

  res.status(StatusCodes.CREATED).json({ msg: `New campaign '${campaign.name}' has been created` });
}


//@desc display freelancer's campaigns
//@route GET api/v1/advertisements/campaigns
//@access authentication (freelancers only)
const getCampaigns: RequestHandler = async (req: CustomAuthRequest, res) => {
  const { search, budget_type, budget_range } = req.query;

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

  // campaign aggregation
  const campaignsAggregation = await advertisementModels.Campaign.aggregate([
    {
      $match: match
    },
    {
      $lookup: {
        from: "ads",
        localField: "ads",
        foreignField: "_id",
        as: "ads"
      }
    },
    {
      $addFields: {
        totalAds: {
          $size: "$ads"
        }
      }
    },
    {
      $addFields: {
        activeAds: {
          $size: {
            $filter: {
              input: "$ads",
              as: "ad",
              cond: {
                $eq: ["$$ad.status", "active"]
              }
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
        isActive: 1,
        createdAt: 1,
        totalAds: 1,
        activeAds: 1
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
  const campaign = await advertisementModels.Campaign.findById(campaignId)
    .populate({
      path: "ads",
      // select: "-dailyBudgetAllocation",
      populate: {
        path: "service",
        select: "_id title"
      }
    });

  // check if the campaign exists
  if (!campaign) {
    throw new NotFoundError(`Found no campaign with ID ${campaignId}`);
  }

  // check if campaign belongs to the current freelancer
  if (campaign.user._id.toString() !== profile.user._id.toString()) {
    throw new UnauthorizedError("You dont have access to this campaign");
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

    const currentTime = new Date(Date.now()).getTime();
    const alreadyPassedAds = ad.displayPeriods!.filter(ad => new Date(ad.endTime).getTime() < currentTime);
    const hasAlreadyStartedDate = currentTime > new Date(campaign.startDate).getTime();


    const displayAmount = getDisplayAmount({
      bidAmount: ad.bidAmount!,
      budgetAllocation: ad.budgetAllocation!,
      event: ad.event!
    });

    const budgetTypeChanged = validUpdatedCampaignDetails.budgetType && (validUpdatedCampaignDetails.budgetType !== campaign.budgetType);
    const campaignBudgetChanged = validUpdatedCampaignDetails.budget && (validUpdatedCampaignDetails.budget !== campaign.budget);
    const endDateChanged = validUpdatedCampaignDetails.endDate && (validUpdatedCampaignDetails.endDate !== campaign.endDate);

    if (budgetTypeChanged || campaignBudgetChanged || endDateChanged) {
      const displayPeriods = generateDisplayPeriods({
        campaignBudgetType: validUpdatedCampaignDetails.budgetType || campaign.budgetType,
        displayAmount: displayAmount - alreadyPassedAds.length,
        startDate: hasAlreadyStartedDate ? new Date(Date.now()) : campaign.startDate,
        endDate: validUpdatedCampaignDetails.endDate || campaign.endDate
      });

      newDisplayPeriods = [...alreadyPassedAds, ...displayPeriods];
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
    keywords: input.keywords,
    displayPeriods: [],
    country: input.country,
    status: "active",
    budgetAllocation: input.bidAmount, // initial budget allocation value
    budgetAllocationCompleted: false
  }

  // create ad
  const ad = await advertisementModels.Ad.create(newAd);

  // push the ad to the campaign
  campaign.ads.push(ad);
  await campaign.save();

  // get the calculated daily budget allocation for each ad
  const ads = calcBudgetAllocation({
    ads: campaign.ads.filter(ad => ad.status === "active"),
    campaignBudget: campaign.budget
  });

  // loop through ads to update their daily budget allocation
  const updates = ads.map(ad => {

    const currentTime = new Date(Date.now()).getTime();
    const alreadyDisplayedAds = ad.displayPeriods!.filter(ad => new Date(ad.endTime).getTime() < currentTime);
    const campaignAlreadyStarted = new Date(campaign.startDate).getTime() < currentTime;

    const displayAmount = getDisplayAmount({
      bidAmount: ad.bidAmount!,
      budgetAllocation: ad.budgetAllocation!,
      event: ad.event!
    });

    const adPeriods = generateDisplayPeriods({
      displayAmount: displayAmount - alreadyDisplayedAds.length,
      campaignBudgetType: campaign.budgetType,
      endDate: campaign.endDate,
      startDate: campaignAlreadyStarted ? new Date(Date.now()) : campaign.startDate
    });

    const displayPeriods = [...alreadyDisplayedAds, ...adPeriods];

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

  // check if bid amount changing so must change daily budget allocation to all campaign ads
  if ((updatedAdDetails.bidAmount && updatedAdDetails.bidAmount !== ad.bidAmount) || (updatedAdDetails.status && updatedAdDetails.status !== ad.status)) {
    const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id } }).populate({ path: "ads" });
    if (!campaign) {
      throw new BadRequestError(`Found no campaign for this ad`);
    }

    // get the calculated daily budget allocation for each ad
    const updatedAds = calcBudgetAllocation({
      ads: campaign.ads.filter(ad => ad.status === "active"),
      campaignBudget: campaign.budget
    });

    // loop through ads to update their daily budget allocation
    const updates = updatedAds.map(ad => {
      const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
        updateOne: {
          filter: {
            _id: ad._id
          },
          update: {
            $set: {
              budgetAllocation: ad.budgetAllocation
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
  const update = updatedAds.map(ad => {
    const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
      updateOne: {
        filter: {
          _id: ad._id
        },
        update: {
          $set: {
            budgetAllocation: ad.budgetAllocation
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

export {
  createCampaign,
  getCampaigns,
  getCampaignDetails,
  updateCampaign,
  deleteCampaign,
  createAd,
  updateAd,
  deleteAd
}
