import express from "express";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";
import reportControllers from "../dashboard/reports/reports.controller";
import {
    createReport,
    getReports
} from "./report.controller";

const router = express.Router();

router.route("/")
    .get(authentication, authorization("admin"), getReports)
    .post(authentication, createReport);

// authorized analytics
router.get("/analysis/report", authentication, authorization("admin"), reportControllers.getReportAnalysis);

export default router;
