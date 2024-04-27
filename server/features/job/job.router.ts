import { Router } from "express";
import { getAllJobs, createJob, deleteJob, singleJob, updateJob, getEmployerJobs } from "./job.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";
import getJobsAnalysis from "../dashboard/jobs/jobs.controller";

const router = Router();

router.route("/")
    .get(getAllJobs)
    .post(authentication, createJob);

router.route("/profile/employer-jobs")
    .get(authentication, getEmployerJobs)

router.route("/:jobId")
    .get(singleJob)
    .patch(authentication, updateJob)
    .delete(authentication, deleteJob);

// console.log(getJobsAnalysis);



// authorized analytics
router.get("/analysis/job", authentication, authorization("admin"), getJobsAnalysis);


export default router;