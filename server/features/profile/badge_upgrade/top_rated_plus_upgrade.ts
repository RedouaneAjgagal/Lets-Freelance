import { contractModel as Contract } from "../../contract";
import batchingUpgrade from "./batchingUpgrade";
import completedProfileAggregateMatch from "./completedProfileAggregateMatch";

const topRatedPlusUpgrade = async () => {
    const TWELVE_MONTHS_AGO = new Date(Date.now() - (12 * 30 * 24 * 60 * 60 * 1000)); // payments for the last 360 days
    const SIX_MONTHS_AGO = new Date(Date.now() - (6 * 30 * 24 * 60 * 60 * 1000)); // first contract must be at least 180 days old
    const MINIMUM_AMOUNT_PER_CONTRACT = 1000; // at least total of $1000 per contract to mark it as a large contract 

    const aggregateData: { _id: string }[] = await Contract.aggregate([
        {
            // filter by only jobs
            $match: {
                $and: [
                    { activityType: "job" }
                ]
            }
        },
        {
            $lookup: {
                from: "profiles",
                localField: "freelancer.profile",
                foreignField: "_id",
                as: "profile"
            }
        },
        {
            $unwind: "$profile"
        },
        {
            $lookup: {
                from: "users",
                localField: "freelancer.user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $match: {
                ...completedProfileAggregateMatch, // check if completed profile
                "profile.rating.avgRate": { $gte: 4.5 }, // qualified profile must have 4.5 raing or above
                "profile.roles.freelancer.badge": "top rated" // profile must be TOP RATED
            }
        },
        {
            $project: {
                profile: "$profile._id",
                payments: "$payments",
                createdAt: 1
            }
        },
        {
            // select only the paid payments
            $addFields: {
                paidPaymentsPerContract: {
                    $filter: {
                        input: "$payments",
                        as: "payment",
                        cond: { $eq: ["$$payment.freelancer.status", "paid"] }
                    }
                }
            }
        },
        {
            // select only payments that has been paid in the last 12 months
            $addFields: {
                paidPaymentsPerContractInTwelveMonths: {
                    $filter: {
                        input: "$paidPaymentsPerContract",
                        as: "payment",
                        cond: { $gte: ["$$payment.freelancer.paidAt", TWELVE_MONTHS_AGO] }
                    }
                }
            }
        },
        {
            $addFields: {
                totalAmountPerContract: {
                    $sum: {
                        $map: {
                            input: "$paidPaymentsPerContractInTwelveMonths",
                            as: "paidPayment",
                            in: "$$paidPayment.amount"
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: "$profile",
                totalAmount: {
                    $sum: {
                        // select only total payments that has made above the minimum amount per contract
                        $cond: [{ $gte: ["$totalAmountPerContract", MINIMUM_AMOUNT_PER_CONTRACT] }, "$totalAmountPerContract", 0]
                    }
                },
                firstContractCreated: {
                    $min: "$createdAt"
                }
            }
        },
        {
            $match: {
                firstContractCreated: { $lte: SIX_MONTHS_AGO }, // first contract created by the freelancer must be 6 months old
                totalAmount: { $ne: 0 }
            }
        },
        {
            $project: {
                _id: 1
            }
        }
    ]);

    await batchingUpgrade({
        aggregateProfiles: aggregateData,
        batchLimit: 1000,
        delayInMs: 5000,
        upgradeTo: "top rated plus"
    });
}

export default topRatedPlusUpgrade;