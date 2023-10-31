import { Router } from "express";
import { getAllJobs, createJob, deleteJob, singleJob, updateJob, getEmployerJobs } from "./job.controller";
import authentication from "../../middlewares/authentication";

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


export default router;