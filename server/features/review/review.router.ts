import { getServiceReviews, createReview, updateReview, deleteReview, profileReviews } from "./review.controller";
import authentication from "../../middlewares/authentication";

import { Router } from "express";
const router = Router();

router.route("/")
    .get(getServiceReviews)
    .post(authentication, createReview);

router.route("/profile/:profileId")
    .get(profileReviews);

router.route("/:reviewId")
    .patch(authentication, updateReview)
    .delete(authentication, deleteReview);


export default router;