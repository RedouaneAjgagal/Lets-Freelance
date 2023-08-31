import mongoose from "mongoose";
import { IUser } from "../auth/auth.model";
import { IProfile } from "../profile/profile.model";

export type JobTypeWithoutRefs = {
    title: string;
    description: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    priceType: "hourly" | "fixed";
    price: {
        min: number;
        max: number;
    };
    locationType: "remote" | "onsite";
    duration: {
        dateType: "hours" | "days" | "months";
        dateValue: number;
    } | null;
    weeklyHours: {
        min: number;
        max: number;
    };
    experienceLevel: "expert" | "intermediate" | "entryLevel";
    tags: string[];
}


export type JobType = {
    user: { _id: mongoose.Types.ObjectId } & Partial<IUser>;
    profile: { _id: mongoose.Types.ObjectId } & Partial<IProfile>;
} & JobTypeWithoutRefs


const jobSchema = new mongoose.Schema<JobType>({
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

    description: {
        type: String,
        maxlength: [6000, "Description cannot be more than 6000 characters"],
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
            min: 1,
            required: [true, "Minimum price is required"]
        },
        max: {
            type: Number,
            min: 1,
            required: [true, "Maximum price is required"]
        },
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
            default: undefined
        },
        dateValue: {
            type: Number,
            min: 1,
            default: undefined
        },
    },
    weeklyHours: {
        min: {
            type: Number,
            min: 1,
            max: 168,
            required: [true, "Minimum weekly hours is required"]
        },
        max: {
            type: Number,
            min: 1,
            max: 168,
            required: [true, "Maximum weekly hours is required"]
        },
    },
    experienceLevel: {
        type: String,
        enum: {
            values: ["entryLevel", "intermediate", "expert"],
            message: "`{VALUE}` is not supported"
        },
        required: [true, "Experience level is required"]
    },
    tags: {
        type: [],
        require: true
    }
});

const Job = mongoose.model("job", jobSchema);

export default Job;