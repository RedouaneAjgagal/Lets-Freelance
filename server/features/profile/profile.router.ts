import { Router } from "express";
import { profileInfo, singleProfile } from "./profile.controller";
import authentication from "../../middlewares/authentication";


const router = Router();

router.get("/", authentication, profileInfo);
router.get("/:profileId", singleProfile);

export default router;