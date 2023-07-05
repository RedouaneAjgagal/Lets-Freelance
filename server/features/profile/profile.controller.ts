import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { CustomAuthRequest } from "../../middlewares/authentication";
import Profile from "./profile.model";
import { UnauthenticatedError } from "../../errors";

const profileInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Cannot find any profile with this id");
    }

    const profileInfo = profile.toObject();

    if (profileInfo.userAs === "employer") {
        profileInfo.roles!.freelancer = undefined;
    } else {
        profileInfo.roles!.employer = undefined;
    }


    res.status(StatusCodes.OK).json(profileInfo);
}

export {
    profileInfo
}