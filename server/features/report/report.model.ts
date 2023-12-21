import mongoose from "mongoose";
import { IProfile } from "../profile";
import { IService } from "../service";
import { JobType } from "../job";
import { IUser } from "../auth";

export type ReportWithoutRefs = {
    event: "profile" | "service" | "job";
    subject: string;
    message: string;
}

export type ReportType = {
    subbmitedByUser: {
        _id: mongoose.Types.ObjectId;
    } & IUser;
    profile: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IProfile>;
    service: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IService>;
    job: {
        _id: mongoose.Types.ObjectId;
    } & Partial<JobType>;
} & ReportWithoutRefs;

const reportSchema = new mongoose.Schema<ReportType>({
    subbmitedByUser: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: String,
        enum: ["profile", "service", "job"],
        required: true
    },
    profile: {
        type: mongoose.Types.ObjectId,
        ref: "Profile"
    },
    service: {
        type: mongoose.Types.ObjectId,
        ref: "Service"
    },
    job: {
        type: mongoose.Types.ObjectId,
        ref: "Job"
    },
    subject: {
        type: String,
        maxlength: 50,
        required: true
    },
    message: {
        type: String,
        maxlength: 500,
    }
}, {
    timestamps: true
});

const Report = mongoose.model("Report", reportSchema);

export default Report;