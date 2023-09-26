import { RequestHandler } from "express";
import { BAD_GATEWAY, StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../../errors";
import { registerInputValidations, loginInputValidations, forgetPasswordValidation, resetPasswordValidation, verifyEmailValidation } from "./validations";
import User from "./auth.model";
import crypto from "crypto";
import sendResetPasswordEmail from "./services/sendResetPasswordEmail";
import { attachCookieToResponse, destroyCookie } from "../../utils/cookies";
import createHash from "../../utils/createHash";
import { CustomAuthRequest } from "../../middlewares/authentication";
import sendResetEmail from "./services/sendResetEmail";
import { resetEmailValidation } from "./validations/authValidations";
import sendVerifyEmail from "./services/sendVerifyEmail";
import { Profile } from "../profile";
import createConnectedAccount from "../../stripe/createConnectedAccount";
import userAsPermission from "../../helpers/userAsOnly";
import stripe from "../../stripe/stripeConntect";

//@desc register a user
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
    sendVerifyEmail({
        email,
        verificationToken,
        emailTitle: `Thank you for joining us ${name}`
    });

    // create new user
    const newUser = await User.create({ name, email, password, verificationToken: hashedToken });

    // create the user profile
    await newUser.createProfile({ userAs, name });

    res.status(StatusCodes.CREATED).json({ msg: "You have created your account successfully." });
}


//@desc login a user
//@route POST /api/v1/auth/login
//@access public
const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    // check if valid values
    loginInputValidations({ email, password });

    // check if user email exist
    const user = await User.findOne({ email });

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
        userId: user._id.toString()
    }, res);



    // const link = await stripe.accountLinks.create({
    //     account: conntectedAccount.id,
    //     type: "account_onboarding",
    //     refresh_url: "http://localhost:5173",
    //     return_url: "http://localhost:5173"
    // });

    res.status(StatusCodes.OK).json({ msg: `Welcome back` });
}


//@desc logout the user
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


//@desc change email request (send verification token to the current email)
//@route GET /api/v1/auth/change-email
//@access authentication
const changeEmail: RequestHandler = async (req: CustomAuthRequest, res) => {
    const user = await User.findById(req.user!.userId);
    if (!user) {
        throw new UnauthenticatedError("Cannot find any user");
    }

    // create change email token
    const changeEmailToken = crypto.randomBytes(70).toString("hex");
    const hashedChangeEmailToken = createHash({
        algorithm: "sha256",
        value: changeEmailToken
    });

    // create change email token expiration date
    const expiresIn = 15 * 60 * 1000; // 15 mins
    const changeEmailTokenExpirationDate = new Date(Date.now() + expiresIn);

    // insert token/exipration to the user document 
    await user.updateOne({
        changeEmailToken: hashedChangeEmailToken,
        changeEmailTokenExpirationDate
    });

    // send a change email request email
    sendResetEmail({
        email: user.email,
        token: changeEmailToken
    });

    res.status(StatusCodes.OK).json({ msg: `We have sent a reset email to ${user.email}` });
}


//@desc reset email
//@route POST /api/v1/auth/reset-email
//@access authentication
const resetEmail: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { newEmail } = req.body;
    const { token } = req.query;

    const user = await User.findById(req.user!.userId);
    if (!user) {
        throw new UnauthenticatedError("Cannot find any user");
    }

    // check if valid values
    resetEmailValidation({
        email: newEmail,
        token: token?.toString()
    });

    // if user didnt request changing the email
    if (user.changeEmailToken === null || user.changeEmailTokenExpirationDate === null) {
        throw new BadRequestError("Must request a reset email first..");
    }

    const hashToken = createHash({
        algorithm: "sha256",
        value: token!.toString()
    });

    // check if valid change email token
    const isValidToken = user.changeEmailToken === hashToken;
    if (!isValidToken) {
        throw new UnauthenticatedError("Verification failed");
    }

    //  check if the token didnt expire yet
    const isValidExpirationDate = new Date(user.changeEmailTokenExpirationDate!).getTime() > new Date(Date.now()).getTime();
    if (!isValidExpirationDate) {
        throw new UnauthenticatedError("Token has expired");
    }

    // check if the new email is not exist
    const isEmailExist = await User.findOne({ email: newEmail });
    if (isEmailExist) {
        throw new BadRequestError("This email already exist");
    }

    // create a new verification email token
    const emailVerificationToken = crypto.randomBytes(60).toString("hex");
    const hashedToken = createHash({
        algorithm: "sha256",
        value: emailVerificationToken
    });

    // insert new values and set verified email and verified date to null
    user.email = newEmail;
    user.isVerified = false;
    user.verificationToken = hashedToken;
    user.verifiedDate = null;
    user.changeEmailToken = null;
    user.changeEmailTokenExpirationDate = null;
    await user.save();

    // send a verification email fot this new email
    sendVerifyEmail({
        email: newEmail,
        verificationToken: emailVerificationToken,
        emailTitle: "Email Verification"
    });

    res.status(StatusCodes.OK).json({ msg: "You have changed your email successfully" });
}


//@desc change password request (send verification token via enail)
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


//@desc change user's password
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




//@desc create stipe conntect to pay freelancers after completing jobs
//@route GET /api/v1/auth/set-payment-method
//@acess authentication (only freelancers)
const createStripeConnect: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { accountNumber, routingNumber, country, currency, address, accountHolderName, accountHolderType, firstName, lastName, dob, phoneNumber } = req.body;

    // find the current user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current user is a freelancer
    userAsPermission({
        currentUserRole: user.profile!.userAs!,
        permissionedRole: "freelancer"
    });

    // check if the freelancer already set bank info
    if (user.stripe.id) {
        throw new BadRequestError("You have already set bank information");
    }

    // create conntect stipe account
    const conntectedAccount = await createConnectedAccount({
        userId: user._id.toString(),
        profileId: user.profile!._id.toString(),
        email: user.email,
        country,
        externalAccount: {
            object: "bank_account",
            account_number: accountNumber,
            routing_number: routingNumber,
            account_holder_name: accountHolderName,
            account_holder_type: accountHolderType,
            country,
            currency
        },
        individual: {
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            address,
            dob,
        },
        tosAcceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: req.ip,
            user_agent: req.headers["user-agent"]
        }
    });

    // set connected stipe id to the user info
    user.stripe = {
        id: conntectedAccount.id,
        accountLastFour: accountNumber.slice(-4)
    }
    await user.save();

    res.status(StatusCodes.OK).json({ msg: "You have set your bank info successfully" });
}





//@desc get current user info
//@route GET /api/v1/auth/current-user
//@acess authentication
const userInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { userId, exp } = req.user!;

    const expirationDate = new Date(exp * 1000).getTime();

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    res.status(StatusCodes.OK).json({ userId, profileId: profile._id, userName: profile.name, avatar: profile.avatar, expirationDate });
}


export {
    register,
    login,
    logout,
    verifyEmail,
    changeEmail,
    resetEmail,
    forgetPassword,
    resetPassword,
    createStripeConnect,
    userInfo
}