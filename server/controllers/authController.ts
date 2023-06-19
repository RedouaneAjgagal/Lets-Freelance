import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../errors";
import authInputValidations from "../utils/authInputValidations";
import User from "../models/userModel";
import crypto from "crypto";
import hashData from "../utils/hashToken";
import sendRegisterEmail from "../utils/sendRegisterEmail";


//@desc Register a user
//@route POST /api/v1/auth/register
//@access public
const register: RequestHandler = async (req, res) => {
    const { name, email, password, userAs } = req.body;

    // check if valid values
    authInputValidations({ name, email, password, userAs });

    // check if email is not exist
    const user = await User.findOne({ email });
    if (user) {
        throw new BadRequestError("Email is already exist, please choose another email.");
    }

    // generate and hash the verification token
    const verificationToken = crypto.randomBytes(60).toString("hex");
    const hashedToken = await hashData(verificationToken, 10);

    // send unhashed verification token via email
    sendRegisterEmail({
        name,
        email,
        verificationToken
    });

    // create new user
    await User.create({ name, email, password, verificationToken: hashedToken, userAs });

    res.status(StatusCodes.CREATED).json({ result: "You have created your account successfully." });
}


//@desc Login a user
//@route POST /api/v1/auth/login
//@access public
const login: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ result: "success" });
}


//@desc Request a user's password (send token via enail)
//@route POST /api/v1/auth/forget-password
//@access public
const forgetPassword: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ result: "success" });
}


//@desc Change user's password
//@route PATCH /api/v1/auth/reset-password
//@access public
const resetPassword: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ result: "success" });
}


export {
    register,
    login,
    forgetPassword,
    resetPassword
}