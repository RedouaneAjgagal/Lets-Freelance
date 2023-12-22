import mongoose from "mongoose";
import { IUser } from "../auth";
import { IProfile } from "../profile";
import { IService } from "../service";
import { JobType } from "../job";

export type FavoutiteWithRefs = {
    event: "service" | "job" | "profile";
}

export type FavoutiteType = {
    user: {
        _id: mongoose.Types.ObjectId;
    } & IUser;
    target: {
        _id: mongoose.Types.ObjectId
    } & (IProfile | IService | JobType);
} & FavoutiteWithRefs;

const favouriteSchema = new mongoose.Schema<FavoutiteType>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: String,
        enum: ["service", "job", "profile"],
        required: true
    },
    target: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

const Favourite = mongoose.model("favourite", favouriteSchema);

export default Favourite;