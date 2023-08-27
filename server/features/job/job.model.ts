import mongoose from "mongoose";
import { IUser } from "../auth/auth.model";
import { IProfile } from "../profile/profile.model";

interface IJob {
    user: { _id: mongoose.Types.ObjectId } & Partial<IUser>;
    profile: { _id: mongoose.Types.ObjectId } & Partial<IProfile>;
    title: string;
    details: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    priceType: "hourly" | "fixed";
    price: {
        min: number;
        max: number;
    };
    locationType: "remote" | "onsite";
    duration: {
        dateType: "hours" | "days" | "months";
        date: number;
    } | undefined;
    weeklyHours: {
        min: number;
        max: number;
    };
    experienceLevel: "expert" | "intermediate" | "entryLevel";
    skills: string[];
}

const jobSchema = new mongoose.Schema<IJob>({
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
    title: {
        type: String,
        maxlength: [50, "Title cannot be more than 50 characters"],
        required: [true, "Job title is required"]
    },
    details: {
        type: String,
        maxlength: [50, "Details cannot be more than 6000 characters"],
        required: [true, "Job title is required"]
    },
    category: {
        type: String,
        enum: {
            values: ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"],
            message: "`{VALUE}` is not supported"
        },
        required: [true, "Job Category is required"]
    },
    priceType: {
        type: String,
        enum: {
            values: ["hourly", "fixed"],
            message: "`{VALUE}` is not supported"
        },
        required: [true, "Price's job type is required"]
    },
    price: {
        min: {
            type: Number,
            required: [true, "Minimum price is required"]
        },
        max: {
            type: Number,
            required: [true, "Maximum price is required"]
        },
        required: true
    },
    locationType: {
        type: String,
        enum: {
            values: ["remote", "onsite"],
            message: "`{VALUE}` is not supported"
        },
        required: [true, "Location job's type is required"]
    },
    duration: {
        dateType: {
            type: String,
            enum: {
                values: ["hours", "days", "months"],
                message: "`{VALUE}` is not supported"
            },
            required: [true, "Duration job's type is required"]
        },
        date: {
            type: Number,
            required: [true, "Duration date is required"]
        },
        required: false
    },
    weeklyHours: {
        min: {
            type: Number,
            required: [true, "Minimum weekly houres is required"]
        },
        max: {
            type: Number,
            required: [true, "Maximum weekly houres is required"]
        },
        required: true
    },
    experienceLevel: {
        type: String,
        enum: {
            values: ["expert", "intermediate", "entryLevel"],
            message: "`{VALUE}` is not supported"
        },
        required: [true, "Experience level is required"]
    },
    skills: {
        type: []
    }
});

const Job = mongoose.model("job", jobSchema);

export default Job;