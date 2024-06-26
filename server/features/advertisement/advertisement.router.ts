import { Router } from "express";
import authentication from "../../middlewares/authentication";
import { createAd, deleteAd, displayAds, updateAd } from "./advertisement.ads.controller";
import { createCampaign, deleteCampaign, getCampaignDetails, getCampaigns, updateCampaign } from "./advertisement.campaigns.controller";
import { payUnpaidInvoicesAfterNewPaymentMethod, createStripeSetupIntent, deletePaymentMethod, getPaymentMethods } from "./advertisement.payments.controller";
import { trackAdClickAction, trackAdEngagement, trackAdOrderAction } from "./advertisement.performaces.controller";
import authorization from "../../middlewares/authorization";
import campaignControllers from "../dashboard/advertisements/campaign.controller";
import adControllers from "../dashboard/advertisements/ads.controller";


const router = Router();

router.route("/payment-methods")
    .post(authentication, payUnpaidInvoicesAfterNewPaymentMethod)
    .get(authentication, getPaymentMethods);

router.route("/payment-methods/intent")
    .post(authentication, createStripeSetupIntent);

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



// authorized analytics
router.get("/campaigns/analysis/campaign", authentication, authorization("admin"), campaignControllers.getCampaignAnalysis);
router.get("/ads/analysis/ad", authentication, authorization("admin"), adControllers.getAdAnalysis);


export default router;