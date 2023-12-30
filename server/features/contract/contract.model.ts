import mongoose from "mongoose";
import { ServicePlan, IService } from "../service";
import { ProposalType } from "../proposal";
import { JobType } from "../job";
import { IProfile } from "../profile";
import { IUser } from "../auth";

export type ContractRoleType = {
    user: { _id: mongoose.Types.ObjectId } & Partial<IUser>;
    profile: { _id: mongoose.Types.ObjectId } & Partial<IProfile>;
    status: "inProgress" | "completed" | "canceled";
}

export type CancelRequestType = {
    isCancelRequest: boolean;
    subject: string;
    reason: string;
}

export type ContractService = {
    serviceInfo: { _id: mongoose.Types.ObjectId } & IService
    title: IService["title"];
    description: IService["description"];
    tierName: "starter" | "standard" | "advanced";
    tier: ServicePlan;
};

export type ContractJob = {
    jobInfo: { _id: mongoose.Types.ObjectId } & JobType;
    title: JobType["title"];
    description: JobType["description"];
    coverLetter: ProposalType["coverLetter"];
    priceType: ProposalType["priceType"];
    price: ProposalType["price"];
    estimatedTime: ProposalType["estimatedTime"];
    proposal: { _id: mongoose.Types.ObjectId } & Partial<ProposalType>;
};

export type UserPayment = {
    status: "pending" | "paid" | "refunded";
    at: Date;
}

export type FreelancerNet = {
    net: number;
}

export type RefundRequest = {
    status: "pending" | "rejected" | "approved";
    subject: string;
    reason: string;
    requestedAt: string;
}

export type ContractPayments = {
    _id?: typeof mongoose.Types.ObjectId;
    workedHours?: number;
    amount?: number;
    employer?: UserPayment & { refundRequest?: RefundRequest };
    freelancer?: UserPayment & FreelancerNet;
    sessionId?: string;
    chargeId?: string;
}

export type ContractType = {
    freelancer: ContractRoleType;
    employer: ContractRoleType;
    activityType: "service" | "job";
    service: ContractService | undefined;
    job: ContractJob | undefined;
    payments: ContractPayments[];
    cancelRequest: {
        freelancer: CancelRequestType;
        employer: CancelRequestType;
        status: "pending" | "rejected" | "approved" | undefined;
    };
    completedAt?: string;
}

const contractSchema = new mongoose.Schema<ContractType>({
    freelancer: {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        profile: {
            type: mongoose.Types.ObjectId,
            ref: "Profile"
        },
        status: {
            type: String,
            enum: {
                values: ["inProgress", "completed", "canceled"],
                message: "{VALUE} is not supported"
            },
            default: "inProgress"
        }
    },
    employer: {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        profile: {
            type: mongoose.Types.ObjectId,
            ref: "Profile"
        },
        status: {
            type: String,
            enum: {
                values: ["inProgress", "completed", "canceled"],
                message: "{VALUE} is not supported"
            },
            default: "inProgress"
        }
    },
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
            ref: "Service"
        },

        title: {
            type: String
        },
        description: {
            type: String
        },
        tierName: {
            type: String,
            enum: {
                values: ["starter", "standard", "advanced"],
                message: "{VALUE} is not supported"
            }
        },
        tier: {
            deliveryTime: Number,
            price: Number,
            includedIn: [{
                description: {
                    type: String
                },
                result: {
                    type: mongoose.Schema.Types.Mixed
                }
            }]
        }
    },
    job: {
        jobInfo: {
            type: mongoose.Types.ObjectId,
            ref: "Job"
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        coverLetter: {
            type: String
        },
        priceType: {
            type: String,
            enum: {
                values: ["fixed", "hourly"],
                message: "{VALUE} is not supported"
            }
        },
        price: {
            type: Number
        },
        estimatedTime: {
            timeType: {
                type: String,
                enum: {
                    values: ["hours", "days", "months"],
                    message: "{value} is not supported"
                }
            },
            timeValue: {
                type: Number
            }
        },
        proposal: {
            type: mongoose.Types.ObjectId,
            ref: "Proposal"
        }
    },
    payments: [
        {
            workedHours: Number,
            amount: Number,
            employer: {
                status: {
                    type: String,
                    enum: {
                        values: ["pending", "paid", "refunded"],
                        message: "{VALUE} is not supported"
                    }
                },
                at: Date,
                refundRequest: {
                    subject: String,
                    reason: String,
                    requestedAt: Date,
                    status: {
                        type: String,
                        enum: {
                            values: ["pending", "rejected", "approved"],
                            message: "{VALUE} is not supported"
                        }
                    }
                }
            },
            freelancer: {
                status: {
                    type: String,
                    enum: {
                        values: ["pending", "paid", "refunded"],
                        message: "{VALUE} is not supported"
                    }
                },
                at: Date,
                net: {
                    type: Number,
                    default: 0
                }
            },
            sessionId: {
                type: String
            },
            chargeId: {
                type: String
            }
        }
    ],
    cancelRequest: {
        freelancer: {
            isCancelRequest: {
                type: Boolean,
                default: false,
                required: true
            },
            subject: String,
            reason: String
        },
        employer: {
            isCancelRequest: {
                type: Boolean,
                default: false,
                required: true
            },
            subject: String,
            reason: String
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "rejected", "approved"],
                message: "{VALUE} is not supported"
            }
        }
    },
    completedAt: Date
}, {
    timestamps: true
});

const Contract = mongoose.model("Contract", contractSchema);

export default Contract