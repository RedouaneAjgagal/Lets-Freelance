import { Router } from "express";
import { profileInfo } from "./profile.controller";
import authentication from "../../middlewares/authentication";
const router = Router();

router.get("/", authentication, profileInfo);

export default router;