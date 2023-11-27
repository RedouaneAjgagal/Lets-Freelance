import { Router } from "express";
import authentication from "../../middlewares/authentication";
import {
    createCampaign,
    getCampaignDetails,
    getCampaigns,
    updateCampaign,
    deleteCampaign,
    createAd,
    updateAd,
    deleteAd,
    displayAds
} from "./advertisement.controller";


const router = Router();

router.route("/")
    .post(authentication, createCampaign);

router.route("/campaigns")
    .get(authentication, getCampaigns);

router.route("/campaigns/:campaignId")
    .get(authentication, getCampaignDetails)
    .patch(authentication, updateCampaign)
    .delete(authentication, deleteCampaign);

router.route("/ads")
    .get(displayAds)
    .post(authentication, createAd);

router.route("/ads/:adId")
    .patch(authentication, updateAd)
    .delete(authentication, deleteAd);



export default router;