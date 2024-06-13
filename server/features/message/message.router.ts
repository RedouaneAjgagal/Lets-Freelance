import { Router } from "express";
import authentication from "../../middlewares/authentication";
import { getMessages } from "./message.controller";

const router = Router();

router.route("/")
    .get(authentication, getMessages);

export default router;