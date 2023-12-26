import { Router } from "express";
import authentication from "../../middlewares/authentication";
import {
    getAllservices,
    singleService,
    createService,
    updateService,
    deleteService,
    uploadFeaturedImg,
    uploadGallery,
    orderService,
    setServiceAsPaid,
    boughtServices,
    trendingServices,
    getFreelancerServices
} from "./service.controller";
import authorization from "../../middlewares/authorization";
import { serviceControllers } from "../dashboard";

const router = Router();

router.route("/")
    .get(getAllservices)
    .post(authentication, createService);


router.post("/upload-featured", authentication, uploadFeaturedImg);
router.post("/upload-gallery", authentication, uploadGallery);

router.route("/trending")
    .get(trendingServices);

router.route("/profile/bought-services")
    .get(authentication, boughtServices);

router.route("/profile/freelancer-services")
    .get(authentication, getFreelancerServices);

router.route("/:serviceId")
    .get(singleService)
    .patch(authentication, updateService)
    .delete(authentication, deleteService);

router.route("/:serviceId/order")
    .post(authentication, orderService)
    .get(authentication, setServiceAsPaid);


// authorized analytics
router.get("/analysis/service", authentication, authorization("admin"), serviceControllers.getServicesAnalysis);


export default router;