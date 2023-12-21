import express from "express";
import {
    createReport
} from "./report.controller";
import authentication from "../../middlewares/authentication";

const router = express.Router();

router.route("/")
    .post(authentication, createReport);


export default router;
