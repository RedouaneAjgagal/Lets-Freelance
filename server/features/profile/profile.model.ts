import mongoose from "mongoose";
import { User } from "../auth";



export interface IProfile {
    user: {
        _id: typeof mongoose.Types.ObjectId;
        email?: string;
        isVerified?: boolean;
        verifiedDate?: Date | null;
        role?: "user" | "admin" | "owner";
    };
    name: string;
    avatar: string;
    showProfile: boolean;
    userAs: "freelancer" | "employer";
    country?: string;
    phoneNumber?: number;
    description?: string;
    category?: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    roles: {
        freelancer: IFreelancerRole | undefined;
        employer: IEmployerRole | undefined;
    };
}

export interface IFreelancerRole {
    dateOfBirth?: Date;
    hourlyRate?: number;
    jobTitle?: string;
    skills?: string[];
    portfolio?: string;
    gender: "male" | "female";
    englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
    types: "agency freelancers" | "independent freelancers" | "single freelancer";
}

export interface IEmployerRole {
    employees: number;
    company?: string;
    website?: string;
}

const profileSchema = new mongoose.Schema<IProfile>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        minLength: [3, "Name cannot be less than 3 characters."],
        maxLength: [20, "Name cannot be more than 20 characters."],
        required: [true, "Name is required."]
    },
    avatar: {
        type: String,
        required: true
    },
    country: String,
    phoneNumber: Number,
    showProfile: {
        type: Boolean,
        default: true,
        required: true
    },
    userAs: {
        type: String,
        enum: ["freelancer", "employer"],
        default: "freelancer",
        required: true
    },
    category: {
        type: String,
        enum: ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"],
        default: "programming & tech"
    },
    description: {
        type: String,
        maxLength: 1000
    },
    roles: {
        freelancer: {
            dateOfBirth: Date,
            hourlyRate: Number,
            jobTitle: String,
            skills: Array,
            portfolio: String,
            gender: {
                type: String,
                enum: ["male", "female"],
                default: "male",
                required: true
            },
            englishLevel: {
                type: String,
                enum: ["basic", "conversational", "fluent", "native", "professional"],
                default: "conversational",
                required: true
            },
            types: {
                type: String,
                enum: ["agency freelancers", "independent freelancers", "single freelancer"],
                default: "single freelancer",
                required: true
            }
        },
        employer: {
            company: String,
            website: String,
            employees: {
                type: Number,
                min: 0,
                default: 0
            }
        }
    }
}, { timestamps: true });


// delete all related document
profileSchema.pre("deleteOne", { document: true, query: false }, async function () {
    await User.deleteOne({ _id: this.user._id });
})


const Profile = mongoose.model("Profile", profileSchema);

export default Profile;