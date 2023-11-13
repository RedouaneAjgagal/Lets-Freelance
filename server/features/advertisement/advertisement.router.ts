import { Router } from "express";
import authentication from "../../middlewares/authentication";
import {
    createCampaign,
    getCampaignDetails,
    getCampaigns,
    updateCampaign
} from "./advertisement.controller";


const router = Router();

router.route("/")
    .post(authentication, createCampaign);

router.route("/campaigns")
    .get(authentication, getCampaigns);

router.route("/campaigns/:campaignId")
    .get(authentication, getCampaignDetails)
    .patch(authentication, updateCampaign);


export default router;