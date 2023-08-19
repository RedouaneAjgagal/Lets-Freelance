import mongoose from "mongoose";

type ServicePlan = {
    deliveryTime: number;
    price: number;
    includedInPackage: {
        description: string;
        result: string | number | boolean;
    }[];
}

type ServiceTier = {
    starter: ServicePlan;
    standard: ServicePlan;
    advanced: ServicePlan;
}

export interface IService {
    user: {
        _id: string
    };
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
    title: {
        type: String,
        maxLength: [50, "Title cannot be more than 50 characters"],
        required: [true, "Service title is required"]
    },
    tier: {
        starter: {
            deliveryTime: Number,
            price: Number,
            includedInPackage: [{
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
            includedInPackage: [{
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
            includedInPackage: [{
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
    category: {
        type: String,
        enum: ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"],
        default: "programming & tech",
        required: [true, "Service category is required"]
    },
    description: {
        tyep: String,
        maxlength: [1000, "Title cannot be more than 1000 characters"],
        required: [true, "Service description is required"]
    },
    featuredImage: {
        type: String,
        required: [true, "Featured image is required"]
    },
    gallery: Array
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;