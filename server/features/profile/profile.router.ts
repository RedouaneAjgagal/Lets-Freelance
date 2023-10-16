import { Router } from "express";
import { profileInfo, singleProfile, uploadAvatar, updateProfile, deleteProfile, deleteSingleProfile, buyConnects, setPaidConnects } from "./profile.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";


const router = Router();


router.route("/")
    .get(authentication, profileInfo)
    .post(authentication, uploadAvatar)
    .patch(authentication, updateProfile)
    .delete(authentication, deleteProfile);

router.route("/connects")
    .post(authentication, buyConnects)
    .get(authentication, setPaidConnects);

router.route("/:profileId")
    .get(singleProfile)
    .delete(authentication, authorization("admin"), deleteSingleProfile);

export default router;