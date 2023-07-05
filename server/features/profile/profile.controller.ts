import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { CustomAuthRequest } from "../../middlewares/authentication";
import Profile from "./profile.model";
import { NotFoundError, UnauthenticatedError } from "../../errors";
import getProfileInfo from "./utils/getProfileInfo";


//@desc get current user profile
//@route GET /api/v1/profile
//@access authenticated users
const profileInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "email" });
    if (!profile) {
        throw new UnauthenticatedError("Cannot find any profile with this id");
    }
    const profileInfo = getProfileInfo(profile.toObject());
    res.status(StatusCodes.OK).json(profileInfo);
}


//@desc get signle profile info 
//@route GET /api/v1/profile/:profileId
//@access public
const singleProfile: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId).populate({ path: "user", select: "email" });
    if (!profile) {
        throw new NotFoundError("Found no profile");
    }
    const profileInfo = getProfileInfo(profile.toObject());
    res.status(StatusCodes.OK).json(profileInfo);
}


export {
    profileInfo,
    singleProfile
}