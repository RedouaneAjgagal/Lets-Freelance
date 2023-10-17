import mongoose from "mongoose";
import { IUser } from "../auth";
import { IProfile } from "../profile";
import { IService } from "../service";
import { JobType } from "../job";
import { ContractType } from "../contract";

export type ReviewWithoutRefs = {
    submittedBy: "freelancer" | "employer";
    activityType: "service" | "job";
    activityTitle: string;
    rating: number;
    description: string;
}

export type ReviewType = {
    freelancer: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IUser>;
    employer: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IProfile>;
    service: {
        _id: mongoose.Types.ObjectId;
    } | undefined & Partial<IService>;
    job: {
        _id: mongoose.Types.ObjectId;
    } | undefined & Partial<JobType>;
    contract: {
        _id: mongoose.Types.ObjectId;
    } & Partial<ContractType>;

} & ReviewWithoutRefs;

const reviewSchema = new mongoose.Schema<ReviewType>({
    freelancer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    employer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    service: {
        type: mongoose.Types.ObjectId,
        ref: "Service"
    },
    job: {
        type: mongoose.Types.ObjectId,
        ref: "Job"
    },
    contract: {
        type: mongoose.Types.ObjectId,
        ref: "Contract",
        required: true
    },
    submittedBy: {
        type: String,
        enum: ["freelancer", "employer"],
        required: true
    },
    activityType: {
        type: String,
        enum: {
            values: ["service", "job"],
            message: "{value} is not supported"
        },
        required: true
    },
    activityTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: [2000, "Review cannot be more than 2000 characters"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
}, {
    timestamps: true
});

reviewSchema.index({ contract: 1, submittedBy: 1, freelancer: 1, employer: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;