import mongoose from "mongoose";
import { IProfile } from "../profile/profile.model";

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

export type ServiceWithoutRefs = {
    title: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    tier: ServiceTier;
    description: string;
    featuredImage: string;
    gallery: string[];
}

export interface IService {
    user: {
        _id: mongoose.Types.ObjectId
    };
    profile: {
        _id: mongoose.Types.ObjectId
    } & Partial<IProfile>;
    title: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    tier: ServiceTier;
    description: string;
    featuredImage: string;
    gallery: string[];
}

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
        maxlength: [1000, "Description cannot be more than 1000 characters"],
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
    }
}, {
    timestamps: true
}
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;