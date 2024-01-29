import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Review, { ReviewType, ReviewWithoutRefs } from "./review.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import createReviewValidator from "./validators/createReviewValidator";
import mongoose, { isValidObjectId, model } from "mongoose";
import getUpdatedReviewInfo from "./validators/getUpdatedReviewInfo";
import rolePermissionChecker from "../../utils/rolePermissionChecker";
import { User } from "../auth";
import { contractModel as Contract } from "../contract";


//@desc get all service reviews
//@route GET /api/v1/reviews
//@access public
const getServiceReviews: RequestHandler = async (req, res) => {
    const { service_id } = req.query;

    // check if valid mongodb id
    const isValidMongooseId = isValidObjectId(service_id);
    if (!isValidMongooseId) {
        throw new BadRequestError("Invalid id");
    }

    const activityReviews = await Review.aggregate([
        {
            $match: {
                service: new mongoose.Types.ObjectId(service_id!.toString()),
                submittedBy: "employer",
                activityType: "service"
            }
        },
        {
            $lookup: {
                from: "profiles",
                foreignField: "user",
                localField: "employer",
                as: "employer"
            }
        },
        {
            $addFields: {
                employer: {
                    $first: "$employer"
                }
            }
        },
        {
            $project: {
                _id: 1,
                activityTitle: 1,
                description: 1,
                rating: 1,
                createdAt: 1,
                updatedAt: 1,
                "employer._id": 1,
                "employer.name": 1,
                "employer.avatar": 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    res.status(StatusCodes.OK).json(activityReviews);
}


//@desc get all profile job reviews
//@route GET /api/v1/reviews/profile/:profileId
//@access public
const profileReviews: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { profileId } = req.params;
    const { completed_reviews_type, inprogress_reviews_type } = req.query;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(profileId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid ID");
    }

    const validActivityTypes = ["job", "service"];

    // check if valid completed reviews type
    if (completed_reviews_type && !validActivityTypes.includes(completed_reviews_type.toString())) {
        throw new BadRequestError("Invalid activity type, must be 'job' or 'service'");
    }

    // check if valid in progress reviews type
    if (inprogress_reviews_type && !validActivityTypes.includes(inprogress_reviews_type.toString())) {
        throw new BadRequestError("Invalid activity type, must be 'job' or 'service'");
    }

    // find user
    const profile = await Profile.findById(profileId);
    if (!profile) {
        throw new NotFoundError(`Found no profile with ID ${profileId}`);
    }

    // get completed job reviews
    const submittedBy = profile.userAs === "employer" ? "freelancer" : "employer";
    const completedReviews = await Review.aggregate([
        {
            $match: {
                $and: [
                    { [profile.userAs]: profile.user._id },
                    { submittedBy },
                    completed_reviews_type ? { activityType: completed_reviews_type } : {}
                ]
            }
        },
        {
            $lookup: {
                from: "contracts",
                localField: "contract",
                foreignField: "_id",
                as: "contract"
            }
        },
        {
            $unwind: "$contract"
        },
        {
            $sort: {
                "contract.completedAt": -1
            }
        },
        {
            $project: {
                _id: 1,
                activityTitle: 1,
                description: 1,
                rating: 1,
                "contract.createdAt": 1,
                "contract.completedAt": 1
            }
        },
    ]);

    // get in progress jobs
    const user = `${[profile.userAs]}.user`;
    const inProgressReviews = await Contract.find({
        [user]: profile.user,
        $and: [
            inprogress_reviews_type ? { activityType: inprogress_reviews_type } : {},
            { "freelancer.status": "inProgress" },
            { "employer.status": "inProgress" }
        ]
    }).select("_id job.title service.title createdAt").sort("-createdAt");

    res.status(StatusCodes.OK).json({ completedReviews, inProgressReviews });
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
    const existedReview = await Review.findOne({ contract: contract._id, [profile.userAs]: profile.user._id, submittedBy: profile.userAs }).lean();
    if (existedReview) {
        throw new BadRequestError(`You have already submitted a review on this ${contract.activityType}`);
    }

    // check if the user already completed the contract
    if (contract[profile.userAs].status !== "completed") {
        throw new BadRequestError("You can't submit a review on uncompleted contract");
    }

    // create the review
    const review = await Review.create({
        contract: contract._id,
        employer: contract.employer.user._id,
        freelancer: contract.freelancer.user._id,
        submittedBy: profile.userAs,
        activityType: contract.activityType,
        activityTitle: contract[contract.activityType]!.title,
        description: reviewInfo.description,
        rating: reviewInfo.rating,
        [contract.activityType]: contract.activityType === "job" ? contract.job!.jobInfo._id : contract.service!.serviceInfo._id
    });

    const reviewData = {
        _id: review._id.toString(),
        activity: review.activityType,
        title: review.activityTitle,
        rating: review.rating,
        description: review.description
    }

    // update profile average rating
    await review.profileAvgRating(profile.userAs);

    // set average rating if its a service review submitted by an employer
    if (review.activityType === "service" && review.submittedBy === "employer") {
        await review.serviceAvgRating();
    }

    res.status(StatusCodes.CREATED).json(reviewData);
}


//@desc update a review
//@route PATCH /api/v1/reviews/reviewId
//@access authentication
const updateReview: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { reviewId } = req.params;
    const { description, rating } = req.body;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(reviewId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid ID");
    }

    // get the valid updated values
    const updatedReviewInfo = getUpdatedReviewInfo({
        description,
        rating
    });

    // find current user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // find review
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new BadRequestError(`Found no review with ID ${reviewId}`);
    }

    // check if the current user have acces to this review
    if (review[review.submittedBy]._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You don't have access to update this review");
    }

    // update the review
    await review.updateOne({
        $set: {
            rating: updatedReviewInfo.rating,
            description: updatedReviewInfo.description
        }
    }, {
        runValidators: true, sanitizeFilter: true, new: true
    });

    // update profile average rating if rating is updated
    if (updatedReviewInfo.rating !== review.rating) {
        await review.profileAvgRating(profile.userAs);

        // update average rating if its a service review
        if (review.activityType === "service" && review.submittedBy === "employer" && review.employer._id.toString() === profile.user._id.toString()) {
            await review.serviceAvgRating();
        }
    }

    res.status(StatusCodes.OK).json({ rating: updatedReviewInfo.rating, description: updatedReviewInfo.description });
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
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "userAs" });
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
    if ((review[review.submittedBy]._id.toString() !== user._id.toString())) {
        throw new UnauthorizedError("You dont have access to delete this review");
    }

    // delete review
    await review.deleteOne();

    // update profile average rating
    await review.profileAvgRating(user.profile!.userAs!);

    // update average rating if its a service review
    if (review.activityType === "service" && review.submittedBy === "employer" && review.employer._id.toString() === user._id.toString()) {
        await review.serviceAvgRating();
    }

    res.status(StatusCodes.OK).json({ msg: `Your review has been deleted` });

}


export {
    getServiceReviews,
    profileReviews,
    createReview,
    updateReview,
    deleteReview
}