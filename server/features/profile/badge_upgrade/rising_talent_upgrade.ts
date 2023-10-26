import { proposalModel as Proposal } from "../../proposal";
import batchingUpgrade from "./batchingUpgrade";
import completedProfileAggregateMatch from "./completedProfileAggregateMatch";

const risingTalentUpgrade = async () => {
    const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

    const conditions = {
        totalProposals: 12,
        approvedProposals: 2,
        oneApprovedProposal: 1,
        interviewingProposals: 3
    }

    const aggregateData: { _id: string }[] = await Proposal.aggregate([
        {
            $lookup: {
                from: "profiles",
                localField: "profile",
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
                localField: "profile.user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $match: {
                createdAt: { $gte: ONE_MONTH_AGO },
                "profile.roles.freelancer.badge": "none",
                ...completedProfileAggregateMatch
            }
        },
        {
            $project: {
                profile: "$profile._id",
                status: "$status",
                _id: 0
            }
        },
        {
            $facet: {
                allProposalProfiles: [
                    {
                        $group: {
                            _id: "$profile",
                            total: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $match: {
                            total: { $gte: conditions.totalProposals }
                        }
                    }
                ],
                twoAndMoreApprovedProfiles: [
                    {
                        $match: { status: "approved" }
                    },
                    {
                        $group: {
                            _id: "$profile",
                            total: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $match: {
                            total: { $gte: conditions.approvedProposals }
                        }
                    }
                ],
                oneApprovedProfiles: [
                    {
                        $match: { status: "approved" }
                    },
                    {
                        $group: {
                            _id: "$profile",
                            total: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $match: {
                            total: { $eq: conditions.oneApprovedProposal }
                        }
                    }
                ],
                interviewingProfiles: [
                    {
                        $match: { status: "interviewing" }
                    },
                    {
                        $group: {
                            _id: "$profile",
                            total: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $match: {
                            total: { $gte: conditions.interviewingProposals }
                        }
                    }
                ]
            }
        },
        // add conditions
        {
            $project: {
                allProposalProfiles: "$allProposalProfiles._id",
                twoAndMoreApprovedProfiles: "$twoAndMoreApprovedProfiles._id",
                oneApprovedProfiles: "$oneApprovedProfiles._id",
                interviewingProfiles: "$interviewingProfiles._id"
            }
        },
        {
            $project: {
                firstCondition: {
                    $setIntersection: ["$twoAndMoreApprovedProfiles", "$allProposalProfiles"]
                },
                secondCondition: {
                    $setIntersection: ["$oneApprovedProfiles", "$interviewingProfiles", "$allProposalProfiles"]
                },
            }
        },
        {
            $project: {
                combinedProfileIds: {
                    $setUnion: ["$firstCondition", "$secondCondition"]
                }
            }
        },
        {
            $unwind: "$combinedProfileIds"
        },
        {
            $project: {
                _id: { $toString: "$combinedProfileIds" }
            }
        }
    ]);

    await batchingUpgrade({
        aggregateProfiles: aggregateData,
        batchLimit: 100,
        delayInMs: 5000,
        upgradeTo: "rising talent"
    });
}

export default risingTalentUpgrade;