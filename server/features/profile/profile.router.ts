import { Router } from "express";
import { profileInfo, singleProfile, updateProfile } from "./profile.controller";
import authentication from "../../middlewares/authentication";


const router = Router();


router.route("/")
    .get(authentication, profileInfo)
    .patch(authentication, updateProfile);


router.get("/:profileId", singleProfile);

export default router;