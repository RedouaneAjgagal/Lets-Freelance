import mongoose from "mongoose";
import { IService } from "../service";
import { IUser } from "../auth";

export type DisplayPeriod = {
    startTime: Date;
    endTime: Date;
}

// --------- Ad --------- //
export type AdTypeWithoutRefs = {
    status: "active" | "inactive";
    bidAmount: number;
    budgetAllocation: number;
    keywords: string[];
    category: IService["category"];
    event: "cpc" | "cpm";
    displayPeriods: DisplayPeriod[];
    country?: string;
    budgetAllocationCompleted: boolean;
}

export type AdType = {
    service: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IService>;
    user: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IUser>;
} & AdTypeWithoutRefs

const adSchema = new mongoose.Schema<AdType>({
    service: {
        type: mongoose.Types.ObjectId,
        ref: "Service",
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        required: true
    },
    bidAmount: {
        type: Number,
        min: [0.1, "You cannot bid with less than $0.1"],
        required: [true, "Bid amount is required"]
    },
    budgetAllocation: {
        type: Number,
        min: [0.1, "Budget allocation cannot be less than $0.1"]
    },
    keywords: {
        type: [{
            type: String
        }]
    },
    category: {
        type: String,
        enum: ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"],
        required: [true, "Ad category is required"]
    },
    event: {
        type: String,
        enum: ["cpc", "cpm"],
        required: [true, "Ad event is required"]
    },
    displayPeriods: [
        {
            startTime: {
                type: Date,
                required: true
            },
            endTime: {
                type: Date,
                required: true
            }
        }
    ],
    country: {
        type: String
    },
    budgetAllocationCompleted: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

const Ad = mongoose.model("Ad", adSchema);



// --------- Campaign --------- //
export type CampaignTypeWithoutRefs = {
    status: "active" | "inactive";
    name: string;
    budget: number;
    budgetType: "daily" | "total";
    startDate: Date;
    endDate: Date;
    isPaused: boolean;
}

export type CampaignType = {
    user: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IUser>;
    ads: ({
        _id: mongoose.Types.ObjectId;
    } & Partial<AdType>)[]
} & CampaignTypeWithoutRefs;

const campaignSchema = new mongoose.Schema<CampaignType>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        required: true
    },
    name: {
        type: String,
        required: [true, "Campaign name is required"]
    },
    budget: {
        type: Number,
        min: [1, "Budget cannot be less than $1"],
        required: [true, "Campaign budget is required"]
    },
    budgetType: {
        type: String,
        enum: ["daily", "total"],
        required: [true, "Compaign budget type is required"]
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    ads: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "Ad",
            required: true
        }],
        required: true
    },
    isPaused: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

// delete all ads related to the deleted campaign
campaignSchema.post("deleteOne", { document: true, query: false }, async function () {
    const ads = this.ads;
    const deleteMany = ads.map(ad => {
        const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
            deleteOne: {
                filter: {
                    _id: ad._id
                }
            }
        }
        return bulkWrite;
    })
    advertisementModels.Ad.bulkWrite(deleteMany);
});

const Campaign = mongoose.model("Campaign", campaignSchema);



// --------- Performance --------- //
type PerformaceTypeWithoutRefs = {
    ip: string;
    userAgent: string;
    isClick: boolean;
    isGuest: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type PerformanceType = {
    ad: {
        _id: mongoose.Types.ObjectId;
    } & AdType
    user?: {
        _id: mongoose.Types.ObjectId;
    } & IUser
} & PerformaceTypeWithoutRefs;

const performanceSchema = new mongoose.Schema<PerformanceType>({
    ad: {
        type: mongoose.Types.ObjectId,
        ref: "Ad",
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    isGuest: {
        type: Boolean,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    isClick: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

const Performance = mongoose.model("Performance", performanceSchema);


// exports
const advertisementModels = {
    Ad,
    Campaign,
    Performance
}

export default advertisementModels