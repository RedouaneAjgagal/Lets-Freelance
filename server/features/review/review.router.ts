import { getServiceReviews, createReview, updateReview, deleteReview } from "./review.controller";
import authentication from "../../middlewares/authentication";

import { Router } from "express";
const router = Router();

router.route("/")
    .get(getServiceReviews)
    .post(authentication, createReview)
    .patch(authentication, updateReview);

router.route("/:reviewId")
    .delete(authentication, deleteReview);


export default router;