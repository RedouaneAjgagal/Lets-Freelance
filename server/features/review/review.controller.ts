import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Review from "./review.model";
import { RequestHandler } from "express";


//@desc get all reviews related to the activity
//@route GET /api/v1/reviews
//@access public
const getActivityReviews: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "all reviews related to this activity" });
}


//@desc create a review
//@route POST /api/v1/reviews
//@access authentication
const createReview: RequestHandler = async (req, res) => {
    res.status(StatusCodes.CREATED).json({ msg: "create a review" });
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