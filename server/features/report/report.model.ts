import mongoose from "mongoose";
import { IProfile } from "../profile";
import { IService } from "../service";
import { JobType } from "../job";

type ReportWithoutRefs = {
    type: "profile" | "service" | "job";
    subject: string;
    message: string;
}

export type ReportType = {
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
    type: {
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
});

const Report = mongoose.model("Report", reportSchema);

export default Report;