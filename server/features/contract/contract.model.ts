import mongoose from "mongoose";
import { ServicePlan, IService } from "../service";
import { ProposalType } from "../proposal";
import { JobType } from "../job";

export type ContractService = {
    serviceInfo: { _id: mongoose.Types.ObjectId } & IService
    belongTo: {
        user: IService["user"];
        profile: IService["profile"];
    };
    title: IService["title"];
    description: IService["description"];
    tierName: "starter" | "standard" | "advanced";
    tier: ServicePlan;
    employer: {
        user: IService["user"];
        profile: IService["profile"];
    };
};

export type ContractJob = {
    jobInfo: { _id: mongoose.Types.ObjectId } & JobType
    belongTo: {
        user: ProposalType["user"];
        profile: ProposalType["profile"];
    };
    coverLetter: ProposalType["coverLetter"];
    priceType: ProposalType["priceType"];
    price: ProposalType["price"];
    estimatedTime: ProposalType["estimatedTime"];
    proposal: { _id: mongoose.Types.ObjectId } & Partial<ProposalType>;
    freelancer: {
        user: ProposalType["user"];
        profile: ProposalType["profile"];
    };
};

export type ContractType = {
    activityType: "service" | "job";
    service: ContractService | undefined;
    job: ContractJob | undefined;
    status: "inProgress" | "completed" | "canceled";
}

const contractSchema = new mongoose.Schema<ContractType>({
    activityType: {
        type: String,
        enum: {
            values: ["service", "job"],
            message: "{VALUE} is not supported"
        },
        required: [true, "Activity type is required"]
    },
    service: {
        serviceInfo: {
            type: mongoose.Types.ObjectId,
            ref: "Service",
            required: true
        },
        belongTo: {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "User",
                required: true
            },
            profile: {
                type: mongoose.Types.ObjectId,
                ref: "Profile",
                required: true
            }
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        tierName: {
            type: String,
            enum: {
                values: ["starter", "standard", "advanced"],
                message: "{VALUE} is not supported"
            },
            required: true
        },
        tier: {
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
        employer: {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "User",
                required: true
            },
            profile: {
                type: mongoose.Types.ObjectId,
                ref: "Profile",
                required: true
            }
        }
    },
    job: {
        jobInfo: {
            type: mongoose.Types.ObjectId,
            ref: "Job",
            required: true
        },
        belongTo: {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "User",
                required: true
            },
            profile: {
                type: mongoose.Types.ObjectId,
                ref: "Profile",
                required: true
            }
        },
        coverLetter: {
            type: String,
            required: true
        },
        priceType: {
            type: String,
            enum: {
                values: ["fixed", "hourly"],
                message: "{VALUE} is not supported"
            },
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        estimatedTime: {
            timeType: {
                type: String,
                enum: {
                    values: ["hours", "days", "months"],
                    message: "{value} is not supported"
                },
                required: true
            },
            timeValue: {
                type: Number,
                required: true
            }
        },
        proposal: {
            type: mongoose.Types.ObjectId,
            ref: "Proposal",
            required: true
        },
        freelancer: {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "User",
                required: true
            },
            profile: {
                type: mongoose.Types.ObjectId,
                ref: "Profile",
                required: true
            }
        }
    },
    status: {
        type: String,
        enum: {
            values: ["inProgress", "completed", "canceled"],
            message: "{VALUE} is not supported"
        },
        default: "inProgress",
        required: true
    }
}, {
    timestamps: true
});

const Contract = mongoose.model("Contract", contractSchema);

export default Contract