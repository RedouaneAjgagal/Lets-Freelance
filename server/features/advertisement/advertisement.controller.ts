import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createCampaignValidator from "./validators/createCampaignValidator";
import { Profile } from "../profile";
import advertisementModels, { AdType, AdTypeWithoutRefs, CampaignType } from "./advertisement.model";
import { serviceModel as Service } from "../service";
import mongoose, { isValidObjectId } from "mongoose";
import { isInvalidBudgetType } from "./validators/inputValidations";


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

  res.status(StatusCodes.CREATED).json(campaign);
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
      $project: {
        _id: 1,
        name: 1,
        budget: 1,
        budgetType: 1
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
  const campaign = await advertisementModels.Campaign.findOne({ _id: campaignId })
    .populate({
      path: "ads",
      select: "-dailyBudgetAllocation",
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


export {
  createCampaign,
  getCampaigns,
  getCampaignDetails
}
