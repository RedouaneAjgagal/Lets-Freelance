import express from "express";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";
import {
    createReport,
    getReports
} from "./report.controller";

const router = express.Router();

router.route("/")
    .get(authentication, authorization("admin"), getReports)
    .post(authentication, createReport);


export default router;
