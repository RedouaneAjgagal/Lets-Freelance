import mongoose from "mongoose";
import { JobType } from "../job/job.model";
import { IProfile } from "../profile/profile.model";
import { IUser } from "../auth";

export type ProposalWithoutRef = {
    coverLetter: string;
    priceType: "hourly" | "fixed";
    price: number;
    estimatedTime: {
        timeType: "hours" | "days" | "months";
        timeValue: number;
    };
    status: "pending" | "interviewing" | "rejected" | "approved";
};

export type ProposalType = {
    job: { _id: mongoose.Types.ObjectId } & Partial<JobType>;
    user: { _id: mongoose.Types.ObjectId } & Partial<IUser>;
    profile: { _id: mongoose.Types.ObjectId } & Partial<IProfile>;
} & ProposalWithoutRef;

const proposalSchema = new mongoose.Schema<ProposalType>({
    job: {
        type: mongoose.Types.ObjectId,
        ref: "Job",
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    profile: {
        type: mongoose.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    coverLetter: {
        type: String,
        maxlength: [3000, "Cover letter cannot be greater than 3000 characters"],
        required: [true, "Cover letter is required"]
    },
    priceType: {
        type: String,
        enum: {
            values: ["hourly", "fixed"],
            message: "{value} is not supported"
        },
        required: [true, "Price type is required"]
    },
    price: {
        type: Number,
        required: [true, "Proposal price is required"]
    },
    estimatedTime: {
        timeType: {
            type: String,
            enum: {
                values: ["hours", "days", "months"],
                message: "{value} is not supported"
            },
            required: [true, "Time type is required"]
        },
        timeValue: {
            type: Number,
            required: [true, "Estimated time is required"]
        }
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "interviewing", "rejected", "approved"],
            message: "{value} is not supported"
        },
        default: "pending",
        required: true
    }
}, {
    timestamps: true
});

proposalSchema.index({ user: 1, profile: 1, job: 1 }, { unique: true });

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;