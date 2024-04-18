import mongoose, { Model } from "mongoose";
import { IService } from "../service";
import { IUser } from "../auth";
import getValidAdKeywordInput from "./helpers/getValidAdKeywordInput";

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
    nextPeriodGenerationDates: Date[];
    country?: string;
    budgetAllocationSpend: number;
    budgetAllocationCompleted: boolean;
    amounts: { date: Date; amount: number }[];
    orders: mongoose.Types.ObjectId[];
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
    nextPeriodGenerationDates: [
        {
            type: Date
        }
    ],
    country: {
        type: String
    },
    budgetAllocationSpend: {
        type: Number,
        default: 0,
        required: true
    },
    budgetAllocationCompleted: {
        type: Boolean,
        default: false,
        required: true
    },
    amounts: [
        {
            date: Date,
            amount: Number
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId
        }
    ]
}, {
    timestamps: true
});

// delete ad's performance related to the deleted ad
adSchema.post("deleteOne", { document: true, query: false }, function () {
    advertisementModels.Performance.bulkWrite([
        {
            deleteOne: {
                filter: {
                    ad: this._id
                }
            }
        }
    ]);
});

const Ad = mongoose.model("Ad", adSchema);



// --------- Campaign --------- //

export type GetSponsoredServicesPayload = {
    keyword: string;
    category: string;
    page: number;
};

type SponsoredService = {
    _id: string;
    service: {
        _id: string;
        title: string;
        category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
        featuredImage: string;
        tier: {
            starter: {
                price: number;
            };
        };
        rating: {
            numOfReviews: number;
            avgRate?: number;
        };
        profile: {
            _id: string;
            name: string;
            avatar: string;
            userAs: "freelancer";
            roles: {
                freelancer: {
                    englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
                    badge: "none" | "rising talent" | "top rated" | "top rated plus";
                };
            };
            country?: string;
        };
        ad: {
            _id: string;
        };
        sponsored: true;
    };
};

export type CampaignPayment = {
    amount: number;
    status: "unpaid" | "pending" | "paid" | "failed";
    at: Date;
    invoiceId: string;
}

export type CampaignTypeWithoutRefs = {
    status: "active" | "inactive";
    name: string;
    budget: number;
    budgetType: "daily" | "total";
    startDate: Date;
    endDate: Date;
    payments: CampaignPayment[];
}

export type CampaignType = {
    user: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IUser>;
    ads: ({
        _id: mongoose.Types.ObjectId;
    } & Partial<AdType>)[];
} & CampaignTypeWithoutRefs;

interface CampaignStatics extends Model<CampaignType> {
    getSponsoredServices(payload: GetSponsoredServicesPayload): Promise<SponsoredService[]>;
}

const campaignSchema = new mongoose.Schema<CampaignType, CampaignStatics>({
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
    payments: [
        {
            amount: Number,
            status: {
                type: String,
                enum: ["unpaid", "pending", "paid", "failed"],
            },
            at: Date,
            invoiceId: String
        }
    ]
}, {
    timestamps: true
});

// delete all ads and ads performance related to the deleted campaign
campaignSchema.post("deleteOne", { document: true, query: false }, async function () {
    const ads = this.ads;

    const adsIds = (foreignField: string) => {
        const deleteMany = ads.map(ad => {
            const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType | PerformanceType> = {
                deleteOne: {
                    filter: {
                        [foreignField]: ad._id
                    }
                }
            }
            return bulkWrite;
        });
        return deleteMany;
    }

    // delete ads
    const deleteAds = adsIds("_id");
    advertisementModels.Ad.bulkWrite(deleteAds);

    // delete ads performance
    const deleteAdsPerformance = adsIds("ad");
    advertisementModels.Performance.bulkWrite(deleteAdsPerformance);
});

campaignSchema.statics.getSponsoredServices = async function (payload: GetSponsoredServicesPayload): Promise<SponsoredService[]> {

    const currentTime = new Date();

    const keyword = getValidAdKeywordInput(payload.keyword);

    if (keyword === "") {
        return [];
    }

    const keywords = keyword.split(" ");

    const sponsoredServices = await this.aggregate([
        {
            $match: {
                status: "active" // find only active campaigns
            }
        },
        {
            // populate ads documents
            $lookup: {
                from: "ads",
                localField: "ads",
                foreignField: "_id",
                as: "ad"
            }
        },
        {
            $unwind: {
                path: "$ad"
            }
        },
        {
            $match: payload.category ? {
                "ad.status": "active", // find only active ads
                "ad.budgetAllocationCompleted": false, // find only uncompleted budget allocations ads
                "ad.category": payload.category // find ads with a specific category
            } : {
                "ad.status": "active", // find only active ads
                "ad.budgetAllocationCompleted": false // find only uncompleted budget allocations ads
            }
        },
        {
            // create an ads array that match current time display
            $addFields: {
                currentDisplayedAds: {
                    $size: {
                        $filter: {
                            input: "$ad.displayPeriods",
                            as: "displayPeriod",
                            cond: {
                                $and: [
                                    { $lte: ["$$displayPeriod.startTime", currentTime] },
                                    { $gte: ["$$displayPeriod.endTime", currentTime] }
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            // get only ads that are visible at the moment
            $match: {
                currentDisplayedAds: { $ne: 0 }
            }
        },
        {
            // create a commonKeywords array where it shows search keywords that match ads keywords 
            $addFields: {
                commonKeywords: {
                    $setIntersection: ["$ad.keywords", keywords]
                }
            }
        },
        {
            // create score field where it multiply by 2 each time a search keyword match ad keywords
            $addFields: {
                score: {
                    $multiply: [
                        { $size: "$commonKeywords" },
                        2
                    ]
                }
            }
        },
        {
            // get only ads that has score is not equal to 0
            $match: {
                score: { $ne: 0 }
            }
        },
        {
            // multiply bid amount by 10 and add it to the score
            $addFields: {
                score: {
                    $add: [
                        "$score",
                        {
                            $multiply: [
                                "$ad.bidAmount",
                                10
                            ]
                        }
                    ]
                }
            }
        },
        {
            // populate the ad service document
            $lookup: {
                from: "services",
                localField: "ad.service",
                foreignField: "_id",
                as: "service"
            }
        },
        {
            $addFields: {
                service: {
                    $arrayElemAt: ["$service", 0]
                }
            }
        },
        {
            // populate the service profile document
            $lookup: {
                from: "profiles",
                localField: "service.profile",
                foreignField: "_id",
                as: "profile"
            }
        },
        {
            $addFields: {
                "service.profile": {
                    $arrayElemAt: ["$profile", 0]
                }
            }
        },
        {
            // get only campaigns where their freelancers doesn't have any unpaid invoices
            $match: {
                "service.profile.roles.freelancer.advertisement.unpaidInvoices": { $eq: [] }
            }
        },
        {
            $sort: {
                score: -1, // make ads with higher score shows first
                "ad.bidAmount": -1, // if multiple ads scores match, then sort by bid amount
                "ad.budgetAllocation": -1, // if multiple ads scores match and bid amount match, then sort by budgetAllocation,
                "ad.createdAt": -1 // if all match then display old ads first
            }
        },
        {
            $limit: payload.page * 2 // display only 2 ads per page
        },
        {
            $skip: (payload.page - 1) * 2 // display the rest of ads based on the search page
        },
        {
            // set service as sponsored
            $set: {
                "service.sponsored": true
            }
        },
        {
            // response with only ad ID, and the service info
            $project: {
                "_id": 1,
                "service._id": 1,
                "service.sponsored": 1,
                "service.title": 1,
                "service.ad._id": "$ad._id",
                "service.featuredImage": 1,
                "service.category": 1,
                "service.tier.starter.price": 1,
                "service.rating": 1,
                "service.profile._id": 1,
                "service.profile.name": 1,
                "service.profile.avatar": 1,
                "service.profile.country": 1,
                "service.profile.userAs": 1,
                "service.profile.roles.freelancer.englishLevel": 1,
                "service.profile.roles.freelancer.badge": 1,
            }
        }
    ]);

    // console.log(sponsoredServices);

    return sponsoredServices;
}


const Campaign = mongoose.model<CampaignType, CampaignStatics>("Campaign", campaignSchema);


// --------- Performance --------- //

export type Tracker = {
    ip: string;
    userAgent: string;
    isClick: boolean;
    isOrder: boolean;
    date: Date;
}

export type PerformaceTypeWithoutRefs = {
    trackers: Tracker[];
    cpmImpressions: number;
    displayCount: number;
    clicks: number;
    orders: number;
    ctr: number;
    cr: number;
    cpc: number;
}

export type PerformanceType = {
    ad: {
        _id: mongoose.Types.ObjectId;
    } & Partial<AdType>;
} & PerformaceTypeWithoutRefs;

const performanceSchema = new mongoose.Schema<PerformanceType>({
    ad: {
        type: mongoose.Types.ObjectId,
        ref: "Ad",
        required: true
    },
    trackers: [
        {
            ip: String,
            userAgent: String,
            isClick: Boolean,
            isOrder: Boolean,
            date: Date
        }
    ],
    cpmImpressions: {
        type: Number,
        default: 0,
        required: true
    },
    displayCount: {
        type: Number,
        default: 0,
        required: true
    },
    clicks: {
        type: Number,
        default: 0,
        required: true
    },
    orders: {
        type: Number,
        default: 0,
        required: true
    },
    ctr: {
        type: Number,
        default: 0,
        required: true
    },
    cr: {
        type: Number,
        default: 0,
        required: true
    },
    cpc: {
        type: Number,
        default: 0,
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