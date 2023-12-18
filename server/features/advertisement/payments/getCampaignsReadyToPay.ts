import mongoose from "mongoose";
import advertisementModels from "../advertisement.model";
import { CampaignPayment } from "../advertisement.model";

type FreelancerPayment = CampaignPayment & { _id: mongoose.Types.ObjectId }

type FreelancerCampaign = {
    _id: mongoose.Types.ObjectId;
    name: string;
    payment: FreelancerPayment;
}

export type FreelancerCampaigns = {
    user: {
        _id: mongoose.Types.ObjectId;
        stripe: {
            customer_id: string;
        }
    };
    campaigns: FreelancerCampaign[]
}

const getCampaignsReadyToPay = async () => {
    const freelancersCampaigns: FreelancerCampaigns[] = await advertisementModels.Campaign.aggregate([
        {
            $match: {
                status: "active"
            }
        },
        {
            $addFields: {
                payment: {
                    $reduce: {
                        input: {
                            $filter: {
                                input: "$payments",
                                as: "payment",
                                cond: {
                                    $eq: ["$$payment.status", "unpaid"]
                                }
                            }
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$this.amount", "$$value"]
                        }
                    }
                }
            }
        },
        {
            $match: {
                payment: {
                    $gt: 0
                }
            }
        },
        {
            $group: {
                _id: "$user",
                campaigns: {
                    $push: {
                        payment: {
                            $first: {
                                $filter: {
                                    input: "$payments",
                                    as: "payment",
                                    cond: {
                                        $and: [
                                            { $eq: ["$$payment.status", "unpaid"] },
                                            { $gt: ["$$payment.amount", 0] },
                                        ]
                                    }
                                }
                            }
                        },
                        _id: "$_id",
                        name: "$name"
                    }
                }
            }
        },
        {
            $project: {
                user: "$_id",
                campaigns: 1,
                _id: 0
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project: {
                user: {
                    $first: "$user"
                },
                campaigns: 1
            }
        },
        {
            $project: {
                "user._id": 1,
                "user.stripe.customer_id": 1,
                campaigns: 1
            }
        }
    ]);

    return freelancersCampaigns;
}



export default getCampaignsReadyToPay;