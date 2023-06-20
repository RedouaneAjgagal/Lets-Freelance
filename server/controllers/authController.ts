import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../errors";
import { registerInputValidations, loginInputValidations, forgetPasswordValidation, resetPasswordValidation } from "../utils/authInputValidations";
import User from "../models/userModel";
import crypto from "crypto";
import hashData from "../utils/hashData";
import sendRegisterEmail from "../utils/sendRegisterEmail";
import { attachCookieToResponse, destroyCookie } from "../utils/cookies";
import sendResetPasswordEmail from "../utils/sendResetPasswordEmail";
import compareData from "../utils/compareData";
import createHash from "../utils/createHash";


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

//@desc Logout the user
//@route GET /api/v1/auth/logout 
//@access public
const logout: RequestHandler = async (req, res) => {
    destroyCookie(res);
    res.status(StatusCodes.OK).json({ msg: "Logged out successfully." });
}


//@desc Request a user's password (send token via enail)
//@route POST /api/v1/auth/forget-password
//@access public
const forgetPassword: RequestHandler = async (req, res) => {
    const { email } = req.body;

    // check if valid email
    forgetPasswordValidation({ email });

    const user = await User.findOne({ email });

    // pretend to be valid even if there is no user with this email
    if (!user) {
        return res.status(StatusCodes.OK).json({ msg: `We have sent a reset password email to ${email}` });
    }

    // generate and hash reset password token
    const resetPasswordToken = crypto.randomBytes(70).toString("hex");
    const hashedToken = createHash({
        algorithm: "sha256",
        value: resetPasswordToken
    });

    // insert reset token to user data
    user.resetPasswordToken = hashedToken;

    // add expiration time for the reset token
    const resetTokenExipresIn = 15 * 60 * 1000 // 15 min
    user.passwordTokenExpirationDate = new Date(Date.now() + resetTokenExipresIn);
    await user.save();

    // send reset passowrd email
    sendResetPasswordEmail({
        email: user.email,
        resetPasswordToken
    });

    res.status(StatusCodes.OK).json({ msg: `We have sent a reset password email to ${email}` });
}


//@desc Change user's password
//@route PATCH /api/v1/auth/reset-password
//@access public
const resetPassword: RequestHandler = async (req, res) => {
    const { email, token } = req.query;
    const { newPassword, repeatNewPassword } = req.body;

    // check if valid inputs
    resetPasswordValidation({
        email: email?.toString(),
        token: token?.toString(),
        newPassword,
        repeatNewPassword,
    });

    // find the user
    const user = await User.findOne({ email });
    if (!user) {
        // pretend to be valid even if there is no user with this email
        return res.status(StatusCodes.OK).json({ msg: "You have changed your password successfully." });
    }

    // check if the user already requested reset password
    if (user.resetPasswordToken === null || user.passwordTokenExpirationDate === null) {
        throw new BadRequestError("Must request a reset password first.");
    }

    // check if valid reset password token
    const isValidToken = createHash({
        algorithm: "sha256",
        value: token!.toString()
    });
    if (isValidToken !== user.resetPasswordToken) {
        throw new UnauthenticatedError("Invalid credentials.");
    }

    // check if valid expiration date
    const isTokenDateValid = new Date(user.passwordTokenExpirationDate).getTime() > new Date(Date.now()).getTime();
    if (!isTokenDateValid) {
        throw new UnauthenticatedError("Expired token.")
    }

    // check if old password
    const isOldPassword = await user.comparePassword(newPassword);
    if (isOldPassword) {
        throw new BadRequestError("You cant use your old password");
    }

    // set new password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: "You have changed your password successfully." });
}


export {
    register,
    login,
    logout,
    forgetPassword,
    resetPassword
}