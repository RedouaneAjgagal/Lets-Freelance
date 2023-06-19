import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../errors";
import { registerInputValidations, loginInputValidations } from "../utils/authInputValidations";
import User from "../models/userModel";
import crypto from "crypto";
import hashData from "../utils/hashData";
import sendRegisterEmail from "../utils/sendRegisterEmail";
import { attachCookieToResponse } from "../utils/cookies";


//@desc Register a user
//@route POST /api/v1/auth/register
//@access public
const register: RequestHandler = async (req, res) => {
    const { name, email, password, userAs } = req.body;

    // check if valid values
    registerInputValidations({ name, email, password, userAs });

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

    res.status(StatusCodes.CREATED).json({ msg: "You have created your account successfully." });
}


//@desc Login a user
//@route POST /api/v1/auth/login
//@access public
const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    // check if valid values
    loginInputValidations({ email, password });

    // check if user email exist
    const user = await User.findOne({ email });
    if (!user) {
        throw new BadRequestError("Invalid credentials");
    }

    // check if valid password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new BadRequestError("Invalid credentials");
    }

    // attach cookies to response
    attachCookieToResponse({
        userId: user._id.toString(),
        userName: user.name
    }, res);

    res.status(StatusCodes.OK).json({ msg: `Welcome back, ${user.name}` });
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