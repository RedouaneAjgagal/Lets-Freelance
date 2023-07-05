import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../../errors";
import { registerInputValidations, loginInputValidations, forgetPasswordValidation, resetPasswordValidation, verifyEmailValidation } from "./validations";
import User from "./auth.model";
import crypto from "crypto";
import { sendRegisterEmail, sendResetPasswordEmail } from "./services";
import { attachCookieToResponse, destroyCookie } from "../../utils/cookies";
import createHash from "../../utils/createHash";
import { CustomAuthRequest } from "../../middlewares/authentication";


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
    const hashedToken = createHash({
        algorithm: "sha256",
        value: verificationToken
    });

    // send unhashed verification token via email
    sendRegisterEmail({
        name,
        email,
        verificationToken
    });

    // create new user
    const newUser = await User.create({ name, email, password, verificationToken: hashedToken });

    // create the user profile
    await newUser.createProfile({ userAs, name });

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
    const user = await User.findOne({ email }).populate({ path: "profile", select: "avatar name" });

    if (!user) {
        throw new UnauthenticatedError("Invalid credentials");
    }

    // check if valid password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new UnauthenticatedError("Invalid credentials");
    }

    // attach cookies to response
    attachCookieToResponse({
        userId: user._id.toString(),
        userName: user.profile!.name,
        avatar: user.profile!.avatar
    }, res);

    res.status(StatusCodes.OK).json({ msg: `Welcome back, ${user.profile!.name}` });
}


//@desc Logout the user
//@route GET /api/v1/auth/logout
//@access public
const logout: RequestHandler = async (req, res) => {
    destroyCookie(res);
    res.status(StatusCodes.OK).json({ msg: "Logged out successfully." });
}


//@ desc verify user's account via email
//@ route GET /api/v1/auth/verify-email
//@ access public
const verifyEmail: RequestHandler = async (req, res) => {
    const { email, token } = req.query;

    // Check for valid values
    verifyEmailValidation({
        email: email?.toString(),
        token: token?.toString()
    });

    // find the user
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Verification failed.");
    }

    // check if email is already verified
    if (user.isVerified) {
        return res.status(StatusCodes.OK).json({ msg: "Email is already verified." })
    }

    // check if token is valid
    const providedHashedToken = createHash({
        algorithm: "sha256",
        value: token!.toString()
    });
    if (providedHashedToken !== user.verificationToken) {
        throw new UnauthenticatedError("Verification failed.");
    }

    // verify email
    user.isVerified = true;
    user.verifiedDate = new Date(Date.now());
    user.verificationToken = null;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Email verified." });
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
        throw new UnauthenticatedError("Verification failed.");
    }

    // check if the user already requested reset password
    if (user.resetPasswordToken === null || user.passwordTokenExpirationDate === null) {
        throw new BadRequestError("Must request a reset password first.");
    }

    // check if valid reset password token
    const providedHashedToken = createHash({
        algorithm: "sha256",
        value: token!.toString()
    });
    if (providedHashedToken !== user.resetPasswordToken) {
        throw new UnauthenticatedError("Verification failed.");
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


//@desc Get current user info
//@route GET /api/v1/auth/current-user
//@acess Authenticated users
const userInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { userId, userName, avatar } = req.user!;
    res.status(StatusCodes.OK).json({ userId, userName, avatar });
}


export {
    register,
    login,
    logout,
    verifyEmail,
    forgetPassword,
    resetPassword,
    userInfo
}