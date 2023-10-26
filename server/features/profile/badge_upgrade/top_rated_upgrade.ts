import { contractModel as Contract } from "../../contract";
import Profile from "../profile.model";
import batchingUpgrade from "./batchingUpgrade";
import completedProfileAggregateMatch from "./completedProfileAggregateMatch";

const topRatedUpgrade = async () => {
    const NINETY_DAYS_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
    const TWELVE_MONTHS_AGO = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000); // 360 days
    const MINIMUM_AMOUNT = 2500; // $2500 in the last 360 days

    const aggregateData: { _id: string }[] = await Contract.aggregate([
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
            // looking for completed profiles with none or rising talent badge
            $match: {
                ...completedProfileAggregateMatch,
                $or: [
                    { "profile.roles.freelancer.badge": "none" },
                    { "profile.roles.freelancer.badge": "rising talent" },
                ]
            }
        },
        {
            // filter by only payments that has been paid
            $addFields: {
                paidPayments: {
                    $filter: {
                        input: "$payments",
                        as: "payment",
                        cond: { $eq: ["$$payment.freelancer.status", "paid"] },
                    }
                }
            }
        },
        {
            // only select payments in the last 360 days
            $addFields: {
                paidPaymentsInTwelveMonths: {
                    $filter: {
                        input: "$paidPayments",
                        as: "paymentInTwelveMonths",
                        cond: { $gte: ["$$paymentInTwelveMonths.freelancer.paidAt", TWELVE_MONTHS_AGO] }
                    }
                }
            }
        },
        {
            $addFields: {
                totalPayments: {
                    $sum: {
                        $map: {
                            input: "$paidPaymentsInTwelveMonths",
                            as: "paidAmountInTwelveMonths",
                            in: "$$paidAmountInTwelveMonths.amount"
                        }
                    }
                }
            }
        },
        {
            $project: {
                profile: "$freelancer.profile",
                payments: "$totalPayments",
                createdAt: 1,
            }
        },
        {
            $group: {
                _id: "$profile",
                totalPayments: {
                    $sum: "$payments"
                },
                firstContractCreatedAt: {
                    $min: "$createdAt"
                }
            }
        },
        {
            $match: {
                totalPayments: { $gte: MINIMUM_AMOUNT }, // total payemnts must be greated or equal than the minimum amount
                firstContractCreatedAt: { $lte: NINETY_DAYS_AGO } // first contract must be at least 90 days old
            }
        },
        {
            $project: {
                _id: 1,
            }
        },
    ]);

    // upgrade profiles to TOP RATED
    await batchingUpgrade({
        aggregateProfiles: aggregateData,
        batchLimit: 100,
        delayInMs: 5000,
        upgradeTo: "top rated"
    });
}

export default topRatedUpgrade;