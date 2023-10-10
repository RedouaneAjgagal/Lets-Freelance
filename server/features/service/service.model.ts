import mongoose from "mongoose";
import { IProfile } from "../profile/profile.model";
import { IUser } from "../auth";

export type IncludedIn = {
    description: string;
    result: string | number | boolean;
}

export type ServicePlan = {
    deliveryTime: number;
    price: number;
    includedIn: IncludedIn[];
}

export type ServiceTier = {
    starter: ServicePlan;
    standard: ServicePlan;
    advanced: ServicePlan;
}

export type Order = {
    employerId: string;
    sessionId: string;
    amount: number;
    status: "pending" | "paid" | "refunded";
}

export type ServiceWithoutRefs = {
    title: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    tier: ServiceTier;
    description: string;
    featuredImage: string;
    gallery: string[];
    keywords: string[];
    orders: Order[]
}

export type IService = {
    user: {
        _id: mongoose.Types.ObjectId
    } & Partial<IUser>;
    profile: {
        _id: mongoose.Types.ObjectId
    } & Partial<IProfile>;
} & ServiceWithoutRefs

const serviceSchema = new mongoose.Schema<IService>({
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
        maxLength: [50, "Title cannot be more than 50 characters"],
        required: [true, "Service title is required"]
    },
    description: {
        type: String,
        maxlength: [6000, "Description cannot be more than 6000 characters"],
        required: [true, "Service description is required"]
    },
    category: {
        type: String,
        enum: ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"],
        default: "programming & tech",
        required: [true, "Service category is required"]
    },
    featuredImage: {
        type: String,
        required: [true, "Featured image is required"]
    },
    gallery: Array,
    keywords: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],
    tier: {
        starter: {
            deliveryTime: Number,
            price: Number,
            includedIn: [{
                description: {
                    type: String,
                    required: true
                },
                result: {
                    type: mongoose.Schema.Types.Mixed,
                    required: true
                }
            }]
        },
        standard: {
            deliveryTime: Number,
            price: Number,
            includedIn: [{
                description: {
                    type: String,
                    required: true
                },
                result: {
                    type: mongoose.Schema.Types.Mixed,
                    required: true
                }
            }]
        },
        advanced: {
            deliveryTime: Number,
            price: Number,
            includedIn: [{
                description: {
                    type: String,
                    required: true
                },
                result: {
                    type: mongoose.Schema.Types.Mixed,
                    required: true
                }
            }]
        }
    },
    orders: [{
        employerId: {
            type: String
        },
        sessionId: {
            type: String
        },
        amount: {
            type: Number
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "paid", "refunded"],
                message: "{VALUE} is not supported"
            },
            default: "pending"
        }
    }]
}, {
    timestamps: true
}
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;