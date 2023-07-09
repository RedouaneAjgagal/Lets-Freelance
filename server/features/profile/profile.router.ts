import { Router } from "express";
import { profileInfo, singleProfile, updateProfile, deleteSingleProfile } from "./profile.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";


const router = Router();


router.route("/")
    .get(authentication, profileInfo)
    .patch(authentication, updateProfile);


router.route("/:profileId")
    .get(singleProfile)
    .delete(authentication, authorization("admin"), deleteSingleProfile);

export default router;