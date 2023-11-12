import { Router } from "express";
import { createCampaign, getCampaignDetails, getCampaigns } from "./advertisement.controller";
import authentication from "../../middlewares/authentication";


const router = Router();

router.route("/")
    .post(authentication, createCampaign);

router.route("/campaigns")
    .get(authentication, getCampaigns);

router.route("/campaigns/:campaignId")
    .get(authentication, getCampaignDetails);


export default router;