import { getActivityReviews, createReview, updateReview, deleteReview } from "./review.controller";
import authentication from "../../middlewares/authentication";

import { Router } from "express";
const router = Router();

router.route("/")
    .get(getActivityReviews)
    .post(authentication, createReview);


router.route("/:reviewId")
    .patch(authentication, updateReview)
    .delete(authentication, deleteReview);


export default router;