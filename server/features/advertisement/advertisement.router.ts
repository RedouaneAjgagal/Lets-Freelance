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
    displayAds,
    trackAdEngagement,
    trackAdClickAction,
    trackAdOrderAction,
    createPaymentMethods,
    getPaymentMethods,
    deletePaymentMethod
} from "./advertisement.controller";


const router = Router();

router.route("/payment-methods")
    .post(authentication, createPaymentMethods)
    .get(authentication, getPaymentMethods);

router.route("/payment-methods/:paymentMethodId")
    .delete(authentication, deletePaymentMethod);

router.route("/campaigns")
    .post(authentication, createCampaign)
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

router.route("/performace/engagement")
    .patch(trackAdEngagement);

router.route("/performace/actions/click")
    .patch(trackAdClickAction);

router.route("/performace/actions/order")
    .patch(authentication, trackAdOrderAction);



export default router;