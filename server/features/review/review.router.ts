import { getServiceReviews, createReview, updateReview, deleteReview, profileJobReviews } from "./review.controller";
import authentication from "../../middlewares/authentication";

import { Router } from "express";
const router = Router();

router.route("/")
    .get(getServiceReviews)
    .post(authentication, createReview);

router.route("/profile/:profileId")
    .get(authentication, profileJobReviews);

router.route("/:reviewId")
    .patch(authentication, updateReview)
    .delete(authentication, deleteReview);


export default router;