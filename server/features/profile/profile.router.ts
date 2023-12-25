import { Router } from "express";
import {
    profileInfo,
    singleProfile,
    uploadAvatar,
    updateProfile,
    deleteProfile,
    deleteSingleProfile,
    buyConnects,
    setPaidConnects,
    highRatedFrelancers,
    getAllFreelancers,
    getProfileStatements,
    getFreelancerReports,
    getEmployersReports
} from "./profile.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";
import { getEmployersAnalysis, getFreelancersAnalysis } from "./dashboard/admin.controller";


const router = Router();


router.route("/")
    .get(authentication, profileInfo)
    .post(authentication, uploadAvatar)
    .patch(authentication, updateProfile)
    .delete(authentication, deleteProfile);

router.route("/connects")
    .post(authentication, buyConnects)
    .get(authentication, setPaidConnects);

router.route("/high-rated")
    .get(highRatedFrelancers);

router.route("/freelancers")
    .get(getAllFreelancers);

router.route("/freelancers/reports")
    .get(authentication, getFreelancerReports)

router.route("/employers/reports")
    .get(authentication, getEmployersReports);

router.route("/statements")
    .get(authentication, getProfileStatements);

router.route("/:profileId")
    .get(singleProfile)
    .delete(authentication, authorization("admin"), deleteSingleProfile);


// analytics
router.get("/analysis/freelancers", authentication, authorization("admin"), getFreelancersAnalysis);
router.get("/analysis/employers", authentication, authorization("admin"), getEmployersAnalysis);

export default router;