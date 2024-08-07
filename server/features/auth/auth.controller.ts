import { RequestHandler } from "express";
import { BAD_GATEWAY, StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../../errors";
import { registerInputValidations, loginInputValidations, forgetPasswordValidation, resetPasswordValidation, verifyEmailValidation } from "./validations";
import User, { BankInfoWithoutId } from "./auth.model";
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
import createConnectedAccountValidator from "../../stripe/validators/createConnectedAccountValidator";
import Stripe from "stripe";
import mongoose, { isValidObjectId } from "mongoose";
import isValidExternalAccountValues from "../../stripe/helpers/isValidExternalAccountValues";
import origin from "../../config/origin";


type AuthInfoType = {
    _id: string;
    name: string;
    avatar: string;
    userAs: string;
    user: {
        _id: string;
        role: "user" | "admin" | "owner";
    }
}



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
        cookieName: "accessToken",
        expiresInMs: 7 * 24 * 60 * 60 * 1000, // 7 days
        payload: {
            userId: user._id.toString()
        },
        res
    });

    res.status(StatusCodes.OK).json({ msg: `Welcome back` });
}


//@desc logout the user
//@route GET /api/v1/auth/logout
//@access public
const logout: RequestHandler = async (req, res) => {
    destroyCookie({
        cookieName: "accessToken",
        res
    });
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


//@desc get current user info
//@route GET /api/v1/auth/current-user
//@acess authentication
const userInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { userId, exp } = req.user!;

    const expirationDate = new Date(exp * 1000).getTime();

    const [profile] = await Profile.aggregate<AuthInfoType>([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "user",
                as: "users"
            }
        },
        {
            $addFields: {
                user: {
                    $first: "$users"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                avatar: 1,
                userAs: 1,
                "user._id": 1,
                "user.role": 1
            }
        }
    ]);

    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    const authInfo = {
        userId: profile.user._id,
        profileId: profile._id,
        userName: profile.name,
        avatar: profile.avatar,
        userAs: profile.userAs,
        role: profile.user.role,
        expirationDate
    }

    res.status(StatusCodes.OK).json(authInfo);
}


//@desc get bank accounts
//@route GET /api/v1/auth/bank-account
//@acess authentication (only freelancers)
const getBankAccounts: RequestHandler = async (req: CustomAuthRequest, res) => {
    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is a freelancer
    userAsPermission({
        currentUserRole: user.profile!.userAs!,
        permissionedRole: "freelancer"
    });


    const bankAccounts = user.stripe.bankAccounts.map(({ _id, accountLastFour, country, currency, isDefault }) => {
        return { _id, accountLastFour, country, currency, isDefault }
    })

    res.status(StatusCodes.OK).json({
        bankAccounts,
        defaultCurrency: user.stripe.defaultCurrency
    });
}


//@desc create stipe connected bank account for freelancers to be paid
//@route GET /api/v1/auth/bank-account
//@acess authentication (only freelancers)
const createBankAccount: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { accountNumber, routingNumber, accountCountry, currency, address, accountHolderName, accountHolderType, firstName, lastName, dob, phoneNumber, email, ssn } = req.body;

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

    // check if already set bank account
    if (user.stripe.id || user.stripe.bankAccounts.length) {
        throw new BadRequestError("You have already set bank information");
    }

    // external account info
    const externalAccount: Stripe.TokenCreateParams.BankAccount = {
        account_number: accountNumber,
        routing_number: routingNumber,
        account_holder_name: accountHolderName,
        account_holder_type: accountHolderType,
        country: accountCountry,
        currency,
    }

    const individual: { email: any; address: any; dob: any; first_name: any; last_name: any; phone: any; id_number?: string; ssn_last_4?: string } = {
        email,
        address,
        dob,
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber
    }

    if (individual.address?.country === "US") {
        individual.id_number = ssn;
        individual.ssn_last_4 = ssn?.toString().slice(-4);
    }

    if (individual.address?.country === "CA") {
        individual.id_number = ssn;
    }

    // check if valid values
    createConnectedAccountValidator({
        externalAccount,
        individual,
        isSsnRequired: individual.address?.country === "US" || individual.address?.country === "CA"
    });


    // create conntect stipe account
    const conntectedAccount = await createConnectedAccount({
        externalAccount,
        individual,
        userId: user._id.toString(),
        profileId: user.profile!._id.toString(),
        email: user.email,
        country: address.country,
        tosAcceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: req.ip,
            user_agent: req.headers["user-agent"]
        }
    });

    // set stipe and bank info
    (user.stripe.bankAccounts as BankInfoWithoutId[]).push({
        isDefault: true,
        currency: currency.toLowerCase(),
        bankAccountId: conntectedAccount.external_accounts?.data[0].id || "",
        accountLastFour: accountNumber.slice(-4),
        country: externalAccount.country.toUpperCase()
    });

    user.stripe.id = conntectedAccount.id;
    user.stripe.defaultCurrency = currency.toLowerCase()
    await user.save();


    // check if extra info is needed especially for US users needs more info like (ssn_last_4, id_number and identity document)
    let addExtraInfoUrl = "";
    if (!conntectedAccount.payouts_enabled) {
        const { url } = await stripe.accountLinks.create({
            account: conntectedAccount.id,
            type: "account_onboarding",
            refresh_url: origin,
            return_url: origin
        });
        addExtraInfoUrl = url;
    }


    const response: { msg: string; addExtraInfoUrl?: string } = {
        msg: "You have set your bank info successfully"
    }

    // redirect to the url when its exist
    if (addExtraInfoUrl) {
        response.addExtraInfoUrl = addExtraInfoUrl
    }

    res.status(StatusCodes.CREATED).json(response);
}


//@desc delete stripe connected bank account
//@route DELETE /api/v1/auth/bank-account/:bankAccountId
//@acess authentication (only freelancers)
const deleteStripeConnectedBankAccount: RequestHandler = async (req: CustomAuthRequest, res) => {
    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if user is a freelancer
    userAsPermission({
        currentUserRole: user.profile!.userAs!,
        permissionedRole: "freelancer"
    });

    // check if the user already created stripe bank account
    if (!user.stripe.id || !user.stripe.bankAccounts.length) {
        throw new BadRequestError("You haven't create any bank account to delete");
    }

    const deletedAccount = await stripe.accounts.del(user.stripe.id);

    let msg = "Unable to delete this bank account";

    if (deletedAccount.lastResponse.statusCode === 200) {
        user.stripe = { bankAccounts: [] };
        user.save();
        msg = "Your bank account has been deleted successfully";
    }

    res.status(StatusCodes.OK).json({ msg });
}


//@desc Add external bank account
//@route PATCH /api/v1/auth/bank-account
//@acess authentication (only freelancers)
const addExternalBankAccounts: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { accountNumber, routingNumber, accountHolderName, accountHolderType, accountCountry, currency } = req.body;

    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is a freelancer
    userAsPermission({
        currentUserRole: user.profile!.userAs!,
        permissionedRole: "freelancer"
    });

    // check if already a stripe connector
    if (!user.stripe.id) {
        throw new BadRequestError("You have not set a bank account yet");
    }

    // check if valid external account values
    isValidExternalAccountValues({
        account_number: accountNumber,
        routing_number: routingNumber,
        account_holder_name: accountHolderName,
        account_holder_type: accountHolderType,
        country: accountCountry,
        currency
    });

    const externalAccountParams: Stripe.TokenCreateParams.BankAccount = {
        account_number: accountNumber,
        routing_number: routingNumber,
        account_holder_name: accountHolderName,
        account_holder_type: accountHolderType,
        country: accountCountry,
        currency
    };

    const token = await stripe.tokens.create({
        bank_account: externalAccountParams
    });

    const externalAccount = await stripe.accounts.createExternalAccount(user.stripe.id, {
        external_account: token.id,
        default_for_currency: true
    });

    const isDefault = user.stripe.bankAccounts.filter((bankInfo) => bankInfo.currency === currency).length > 0;

    if (isDefault) {
        user.stripe.bankAccounts = user.stripe.bankAccounts.map((bankInfo) => {
            if (bankInfo.currency === currency) {
                return { ...bankInfo, isDefault: false }
            }
            return bankInfo;
        });
    }


    // add external account to the database
    (user.stripe.bankAccounts as BankInfoWithoutId[]).push({
        isDefault,
        currency: token.bank_account!.currency,
        accountLastFour: token.bank_account!.last4,
        country: token.bank_account!.country,
        bankAccountId: externalAccount.id
    });

    user.save();

    res.status(StatusCodes.OK).json({ msg: "You have added a new bank account" });
}


//@desc remove external bank account
//@route DELETE /api/v1/auth/bank-account/:bankAccountId
//@acess authentication (only freelancers)
const removeExternalBankAccount: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { bankAccountId } = req.params;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(bankAccountId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    userAsPermission({
        currentUserRole: user.profile!.userAs!,
        permissionedRole: "freelancer"
    });

    // check if the freelancer already set a bank info
    if (user.stripe.bankAccounts.length < 1) {
        throw new BadRequestError("You must have more than 1 bank account with the same currency to be able to delete");
    }

    // find the bank info
    const isBankInfoExist = user.stripe.bankAccounts.find(({ _id }) => _id.toString() === bankAccountId);
    if (!isBankInfoExist) {
        throw new BadRequestError(`Found no bank info with ID ${bankAccountId}`);
    }

    // check if default bank account
    if (isBankInfoExist.isDefault) {
        throw new BadRequestError(`You cant delete the default bank account, add new one with the same currency to delete this one`)
    }

    // remove the bank info on strip
    await stripe.accounts.deleteExternalAccount(user.stripe.id!, isBankInfoExist.bankAccountId);

    // remove the bank info on the database
    let updatedBankAccounts = user.stripe.bankAccounts.filter(({ _id }) => _id.toString() !== bankAccountId);

    const sameDeletedCurrencyBankAccoount = updatedBankAccounts.filter(bankInfo => bankInfo.currency === isBankInfoExist.currency && user.stripe.defaultCurrency !== isBankInfoExist.currency);


    // set the last bank account to undefault if its not the default currency
    if (sameDeletedCurrencyBankAccoount.length === 1) {
        updatedBankAccounts = updatedBankAccounts.map(bankAccount => {
            if (bankAccount.currency === isBankInfoExist.currency) {
                return { ...bankAccount, isDefault: false }
            }
            return bankAccount;
        });
    }

    // update bank info
    user.stripe.bankAccounts = updatedBankAccounts;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: `Your ${isBankInfoExist.country} bank has been removed` });
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
    getBankAccounts,
    createBankAccount,
    deleteStripeConnectedBankAccount,
    addExternalBankAccounts,
    removeExternalBankAccount,
    userInfo
}