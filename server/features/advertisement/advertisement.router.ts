import { Router } from "express";
import { createCampaign, getCampaigns } from "./advertisement.controller";
import authentication from "../../middlewares/authentication";


const router = Router();

router.route("/")
    .get(authentication, getCampaigns)
    .post(authentication, createCampaign);


export default router;