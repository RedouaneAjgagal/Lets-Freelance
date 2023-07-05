import { Types } from "mongoose";
import { IProfile } from "../profile.model";

const getProfileInfo = (profile: IProfile & { _id: Types.ObjectId } & Required<{ _id: Types.ObjectId }>) => {
    const isFreelancer = profile.userAs === "freelancer";
    profile.roles[isFreelancer ? "employer" : "freelancer"] = undefined;
    return profile;
}

export default getProfileInfo;