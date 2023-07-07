import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { CustomAuthRequest } from "../../middlewares/authentication";
import Profile from "./profile.model";
import { NotFoundError, UnauthenticatedError } from "../../errors";
import getProfileInfo from "./utils/getProfileInfo";
import getUpdatedProfileInfo from "./helpers/getUpdatedProfileInfo";


//@desc get current user profile
//@route GET /api/v1/profile
//@access authentication
const profileInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "email" });
    if (!profile) {
        throw new UnauthenticatedError("Cannot find any profile");
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


//@desc update profile
//@route PATCH /api/v1/profile
//@access authentication
const updateProfile: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Cannot find any profile");
    }

    const newProfileInfo = req.body;
    const updatedProfileInfo = getUpdatedProfileInfo({
        newProfileInfo,
        role: profile.roles[profile.userAs]!,
        userAs: profile.userAs
    });

    await profile.updateOne(updatedProfileInfo);

    res.status(StatusCodes.OK).json({ msg: "Profile has been updated" });
}



export {
    profileInfo,
    singleProfile,
    updateProfile
}