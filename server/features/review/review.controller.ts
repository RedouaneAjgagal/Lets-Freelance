import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Review, { ReviewType, ReviewWithoutRefs } from "./review.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import createReviewValidator from "./validators/createReviewValidator";
import { jobModel as Job } from "../job";
import { serviceModel as Service } from "../service";
import { isValidObjectId } from "mongoose";
import getUpdatedReviewInfo from "./validators/getUpdatedReviewInfo";
import { isInvalidActivityType } from "./validators/reviewInputValidator";
import rolePermissionChecker from "../../utils/rolePermissionChecker";
import { User } from "../auth";
import { contractModel as Contract } from "../contract";


//@desc get all reviews related to the activity
//@route GET /api/v1/reviews
//@access public
const getServiceReviews: RequestHandler = async (req, res) => {
    const { service_id } = req.query;

    // check if valid mongodb id
    const isValidMongooseId = isValidObjectId(service_id);
    if (!isValidMongooseId) {
        throw new BadRequestError("Invalid id");
    }

    // find the activity
    const activityReviews = await Review.find({ service: service_id }).populate({ path: "profile", select: " userAs" }).select("_id activityTitle description rating createdAt updatedAt").lean();

    // get just the employer reviews
    const activityEmployerReviews = activityReviews.filter(review => review.profile.userAs === "employer");

    res.status(StatusCodes.OK).json(activityEmployerReviews);
}


//@desc create a review
//@route POST /api/v1/reviews
//@access authentication
const createReview: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { contractId, description, rating } = req.body;

    // find current user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if valid inputs
    const reviewInfo = createReviewValidator({
        description,
        rating
    });

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(contractId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find the activity (job or service)
    const contract = await Contract.findById(contractId);
    if (!contract) {
        throw new BadRequestError(`Found no contract with ID ${contractId}`);
    }

    // check if the current user have access to this contract
    if (contract[profile.userAs].user._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to this contract");
    }

    // check if the user didnt make any review on this contract yet
    const existedReview = await Review.findOne({ user: profile.user, profile: profile._id, contract: contract._id });
    if (existedReview) {
        throw new BadRequestError(`You have already left a review on this ${contract.activityType}`);
    }

    // check if the user already completed the contract
    if (contract[profile.userAs].status !== "completed") {
        throw new BadRequestError("You can't submit a review on uncompleted contract");
    }

    // create the review
    const review = await Review.create({
        contract: contract._id,
        user: profile.user._id,
        profile: profile._id,
        activityType: contract.activityType,
        activityTitle: contract[contract.activityType]!.title,
        description: reviewInfo.description,
        rating: reviewInfo.rating,
        [contract.activityType]: contract.activityType === "job" ? contract.job!.jobInfo._id : contract.service!.serviceInfo._id
    });

    const reviewData = {
        activity: review.activityType,
        title: review.activityTitle,
        rating: review.rating,
        description: review.description
    }

    res.status(StatusCodes.CREATED).json(reviewData);
}


//@desc update a review
//@route PATCH /api/v1/reviews
//@access authentication
const updateReview: RequestHandler = async (req: CustomAuthRequest, res) => {
    const inputs = req.body;

    // get the valid updated values
    const updatedReviewInfo = getUpdatedReviewInfo(inputs);

    // check if valid mongodb id
    const activityId = inputs.activityId;
    const isValidMongooseId = isValidObjectId(activityId);
    if (!isValidMongooseId) {
        throw new BadRequestError("Invalid id");
    }

    // find current user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // find the review and update it
    const review = await Review.findOneAndUpdate({ profile: profile._id, user: profile.user, [inputs.activityType]: activityId },
        updatedReviewInfo,
        { runValidators: true, sanitizeFilter: true, new: true });


    if (!review) {
        throw new BadRequestError("Found no review to update");
    }

    res.status(StatusCodes.OK).json({ rating: review.rating, description: review.description });
}

//@desc delete a review
//@route DELETE /api/v1/reviews/:reviewId
//@access authentication
const deleteReview: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { reviewId } = req.params;

    // check if valid mongodb id
    const isValidMongooseId = isValidObjectId(reviewId);
    if (!isValidMongooseId) {
        throw new BadRequestError("Invalid review id");
    }

    // find review
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new NotFoundError(`Found no review with id ${reviewId}`);
    }

    // find user
    const user = await User.findById(req.user!.userId);
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if powerful role
    const isValidRole = rolePermissionChecker({
        allowedRoles: ["admin", "owner"],
        currentRole: user.role
    });

    // delete review for powerful roles
    if (isValidRole) {
        if (user.role !== "owner") {
            // create data analytics later for the owner dashboard
        }

        review.deleteOne();
        return res.status(StatusCodes.OK).json({ msg: `Review ID ${review._id} has been deleted by an ${user.role}` });
    }

    // check if the review belongs to current user
    if (review.user._id.toString() !== user._id.toString()) {
        throw new UnauthorizedError("You dont have access to delete this review");
    }

    // delete review
    review.deleteOne();

    res.status(StatusCodes.OK).json({ msg: `Your review has been deleted` });

}


export {
    getServiceReviews,
    createReview,
    updateReview,
    deleteReview
}