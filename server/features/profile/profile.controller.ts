import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { CustomAuthRequest } from "../../middlewares/authentication";
import Profile, { IProfile } from "./profile.model";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import getProfileInfo from "./utils/getProfileInfo";
import getUpdatedProfileInfo from "./helpers/getUpdatedProfileInfo";


//@desc get current user profile
//@route GET /api/v1/profile
//@access authentication
const profileInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "email role" });
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
    const profile = await Profile.findById(profileId).populate({ path: "user", select: "email role" });
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


    // switch roles between freelancer and employer
    const isSwitichingRole: { userAs: IProfile["userAs"] } | undefined = req.body.switchRole;
    if (isSwitichingRole && isSwitichingRole.userAs && (isSwitichingRole.userAs === "employer" || isSwitichingRole.userAs === "freelancer")) {
        await profile.updateOne({ userAs: isSwitichingRole.userAs });
        return res.status(StatusCodes.OK).json({ msg: `Profile now is ${isSwitichingRole.userAs}` });
    }


    // get the correct updated profile info
    const updatedProfileInfo = getUpdatedProfileInfo({
        newProfileInfo: req.body.profileInfo || {},
        roles: profile.roles,
        userAs: profile.userAs
    });

    await profile.updateOne(updatedProfileInfo);

    res.status(StatusCodes.OK).json({ msg: "Profile has been updated" });
}



//@desc delete single profile
//@route DELETE /api/v1/profile/:profileId
//@access authorization
const deleteSingleProfile: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { profileId } = req.params;
    if (!profileId || profileId.trim() === "") {
        throw new BadRequestError("Must provide a profile id");
    }

    // find the target profile
    const ressourceProfile = await Profile.findById(profileId).populate({ path: "user", select: "role" });
    if (!ressourceProfile) {
        throw new NotFoundError("Found no profile");
    }

    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "role" });
    if (!profile) {
        throw new UnauthenticatedError("Found no profile");
    }

    // check if its the current user profile
    if (ressourceProfile._id.toString() === profile._id.toString()) {
        throw new BadRequestError("Cannot delete your account");
    }

    // only delete users but owner can delete any
    if (ressourceProfile.user.role !== "user" && profile.user.role !== "owner" || ressourceProfile.user.role === "owner") {
        throw new UnauthorizedError(`You dont have access to delete ${ressourceProfile.user.role} roles.`);
    }

    // delete profile
    await ressourceProfile.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Account has been deleted" });
}



export {
    profileInfo,
    singleProfile,
    updateProfile,
    deleteSingleProfile
}