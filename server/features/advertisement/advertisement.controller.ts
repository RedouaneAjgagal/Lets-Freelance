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
import calcDailyBudgetAllocation from "./utils/calcDailyBudgetAllocation";


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
    const dailyBudgetAllocation = (ad.bidAmount / getTotalbidAmount) * input.budget;
    ads.push({
      ...ad, user: profile.user._id, dailyBudgetAllocation
    })
  })

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

  // update daily budget allocation to the ads if campaign budget has changed
  if (validUpdatedCampaignDetails.budget) {
    const ads = campaign.ads;

    const budget = validUpdatedCampaignDetails.budget;

    const getTotalbidAmount = ads.reduce((num, ad) => {
      return num + ad.bidAmount!
    }, 0);

    ads.map(async (ad) => {
      const dailyBudgetAllocation = (ad.bidAmount! / getTotalbidAmount) * budget;

      // update daily budget allocation for each ad
      await advertisementModels.Ad.findByIdAndUpdate(ad, {
        dailyBudgetAllocation
      });
    });
  }

  // update campaign
  await campaign.updateOne(validUpdatedCampaignDetails);

  res.status(StatusCodes.OK).json({ msg: `Campaign '${campaign.name}' has been updated` });
}


//@desc add an ad to an existing campaign
//@route PATCH api/v1/advertisements/ads
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

  const newAd: AdType = {
    service: input.service,
    user: profile.user._id,
    bidAmount: input.bidAmount,
    dailyBudgetAllocation: input.bidAmount, // initial value before caluclate based on all ads
    event: input.event,
    category: input.category,
    keywords: input.keywords,
    country: input.country,
    status: "active"
  }

  // create ad
  const ad = await advertisementModels.Ad.create(newAd);

  // push the ad to the campaign
  campaign.ads.push(ad);
  await campaign.save();

  // get the calculated daily budget allocation for each ad
  const ads = calcDailyBudgetAllocation({
    ads: campaign.ads,
    campaignBudget: campaign.budget
  });

  // loop through ads to update their daily budget allocation
  const updates = ads.map(ad => {
    const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
      updateOne: {
        filter: {
          _id: ad._id
        },
        update: {
          $set: {
            dailyBudgetAllocation: ad.dailyBudgetAllocation
          }
        }
      }
    }
    return bulkWrite;
  });

  // update daily budget allocation to all campaign ads
  advertisementModels.Ad.bulkWrite(updates);

  res.status(StatusCodes.CREATED).json({ msg: `New ad has been added to '${campaign.name}' campaign` });
}

export {
  createCampaign,
  getCampaigns,
  getCampaignDetails,
  updateCampaign,
  createAd
}
