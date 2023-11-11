import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createCampaignValidator from "./validators/createCampaignValidator";
import { Profile } from "../profile";
import advertisementModels, { AdType, AdTypeWithoutRefs, CampaignType } from "./advertisement.model";
import { serviceModel as Service } from "../service";
import mongoose from "mongoose";


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


export {
  createCampaign
}
