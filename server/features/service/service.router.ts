import { Router } from "express";
import { getAllservices, singleService, createService, updateService, deleteService, uploadFeaturedImg, uploadGallery, orderService, setServiceAsPaid, boughtServices, trendingServices } from "./service.controller";
import authentication from "../../middlewares/authentication";

const router = Router();

router.route("/")
    .get(getAllservices)
    .post(authentication, createService);


router.post("/upload-featured", authentication, uploadFeaturedImg);
router.post("/upload-gallery", authentication, uploadGallery);

router.route("/trending")
    .get(trendingServices);

router.route("/profile")
    .get(authentication, boughtServices);

router.route("/:serviceId")
    .get(singleService)
    .patch(authentication, updateService)
    .delete(authentication, deleteService);

router.route("/:serviceId/order")
    .post(authentication, orderService)
    .get(authentication, setServiceAsPaid);


export default router;