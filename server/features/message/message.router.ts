import { Router } from "express";
import authentication from "../../middlewares/authentication";
import { getMessages, getContactMessages } from "./message.controller";

const router = Router();

router.route("/")
    .get(authentication, getMessages);

router.route("/users/:userId")
    .get(authentication, getContactMessages);

export default router;