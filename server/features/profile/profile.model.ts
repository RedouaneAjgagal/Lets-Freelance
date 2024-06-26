import mongoose from "mongoose";
import { IUser, User } from "../auth";

export type ConnectPayment = {
    status: "pending" | "paid";
    sessionId: string;
    connectionsCount: number;
    amountPaid?: number;
    paidAt?: string;
}

export type Connects = {
    connectionsCount: number;
    payments: ConnectPayment[];
}

export interface IEmployerRole {
    employees: number;
    companyName?: string;
    website?: string;
    totalJobPosted: number
}

export type Rating = {
    avgRate?: number;
    numOfReviews: number;
}

export interface IFreelancerRole {
    dateOfBirth?: Date;
    hourlyRate?: number;
    jobTitle?: string;
    portfolio?: string;
    gender: "male" | "female";
    englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
    types: "agency freelancers" | "independent freelancers" | "single freelancer";
    skills?: string[];
    education?: {
        title: string;
        academy: string;
        year: string;
        description: string
    }[];
    experience?: {
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
    connects: Connects;
    badge: "none" | "rising talent" | "top rated" | "top rated plus";
    advertisement: {
        unpaidInvoices: string[];
    }
}

export interface IProfile {
    user: Partial<IUser> & { _id: mongoose.Types.ObjectId };
    name: string;
    avatar: string;
    showProfile: boolean;
    userAs: "freelancer" | "employer";
    country?: string;
    phoneNumber?: number;
    description?: string;
    category?: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    rating: Rating;
    roles: {
        freelancer: IFreelancerRole | undefined;
        employer: IEmployerRole | undefined;
    };
    connection: {
        isConnected: boolean;
        disconnectedAt: Date;
    }
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
    rating: {
        avgRate: {
            type: Number,
            min: 1,
            max: 5
        },
        numOfReviews: {
            type: Number,
            default: 0
        }
    },
    roles: {
        freelancer: {
            dateOfBirth: Date,
            hourlyRate: {
                type: Number,
                default: 10,
                required: true
            },
            jobTitle: String,
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
            },
            skills: Array,
            education: Array,
            experience: Array,
            badge: {
                type: String,
                enum: ["none", "rising talent", "top rated", "top rated plus"],
                default: "none"
            },
            connects: {
                payments: [
                    {
                        status: {
                            type: String,
                            enum: ["pending", "paid"]
                        },
                        sessionId: String,
                        connectionsCount: Number,
                        amountPaid: Number,
                        paidAt: Date
                    }
                ],
                connectionsCount: {
                    type: Number,
                    min: 0,
                    required: true,
                    default: 16
                }
            },
            advertisement: {
                unpaidInvoices: [{ type: String }]
            }
        },
        employer: {
            companyName: String,
            website: String,
            employees: {
                type: Number,
                min: 0,
                default: 0
            },
            totalJobPosted: {
                type: Number,
                min: 0,
                default: 0
            }
        }
    },
    connection: {
        isConnected: {
            type: Boolean,
            default: false,
            required: true
        },
        disconnectedAt: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });


// delete all related document
profileSchema.pre("deleteOne", { document: true, query: false }, async function () {
    await User.deleteOne({ _id: this.user._id });
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;