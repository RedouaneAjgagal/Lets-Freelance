import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Review from "./review.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import createReviewValidator from "./validators/createReviewValidator";
import { jobModel as Job } from "../job";
import { serviceModel as Service } from "../service";
import { isValidObjectId } from "mongoose";


//@desc get all reviews related to the activity
//@route GET /api/v1/reviews
//@access public
const getActivityReviews: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "all reviews related to this activity" });
}


//@desc create a review
//@route POST /api/v1/reviews
//@access authentication
const createReview: RequestHandler = async (req: CustomAuthRequest, res) => {
    const inputs = req.body;

    // find current user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if valid inputs
    const reviewInfo = createReviewValidator(inputs);

    // check if valid mongoose id
    const activityId = inputs.activityId;
    const isValidMongooseId = isValidObjectId(activityId);
    if (!isValidMongooseId) {
        throw new BadRequestError("Invalid id");
    }

    // find the activity (job or service)
    const activity = reviewInfo.activityType === "job" ?
        await Job.findById(activityId)
        :
        await Service.findById(activityId);

    if (!activity) {
        throw new NotFoundError(`Found no ${reviewInfo.activityType} with id ${activityId}`);
    }

    // get all review info
    const getReviewInfo = {
        user: profile.user._id,
        profile: profile._id,
        [reviewInfo.activityType]: activityId,
        activityTitle: activity.title,
        ...reviewInfo
    }

    // check if the user didnt create a review on this activiry (service or job) before
    const existedReview = await Review.findOne({ user: profile.user, profile: profile._id, [reviewInfo.activityType]: activityId });
    if (existedReview) {
        throw new BadRequestError(`You have already left a review on this ${reviewInfo.activityType}`);
    }


    // add contract checker later (if the user already completed a contract with this activity then can create a review) 


    // create the review
    const review = await Review.create(getReviewInfo);

    const reviewData = {
        activity: review.activityType,
        title: review.activityTitle,
        rating: review.rating,
        description: review.description
    }

    res.status(StatusCodes.CREATED).json(reviewData);
}


//@desc update a review
//@route PATCH /api/v1/reviews/:reviewId
//@access authentication
const updateReview: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "update a review" });
}

//@desc delete a review
//@route DELETE /api/v1/reviews/:reviewId
//@access authentication
const deleteReview: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "delete a review" });
}


export {
    getActivityReviews,
    createReview,
    updateReview,
    deleteReview
}