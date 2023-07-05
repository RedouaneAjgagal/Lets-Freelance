import mongoose from "mongoose";

interface IProfile {
    user: typeof mongoose.Types.ObjectId;
    name: string;
    avatar: string;
    showProfile: boolean;
    userAs: "freelancer" | "employer";
    location?: string;
    phoneNumber?: number;
    description?: string;
    category?: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    roles: {
        freelancer: IFreelancerRole | undefined;
        employer: IEmployerRole | undefined;
    }
}

interface IFreelancerRole {
    ateOfBirth?: Date;
    hourlyRate?: number;
    jobTitle?: string;
    skills?: string[];
    portfolio?: string;
    gender: "male" | "female";
    englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
    types: "agency freelancers" | "independent freelancers" | "single freelancer";
}

interface IEmployerRole {
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
    location: {
        country: String,
        city: String,
    },
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
        enum: ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"]
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
                default: 0
            }
        }
    }
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;