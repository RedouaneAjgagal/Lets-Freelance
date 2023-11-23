import mongoose from "mongoose";
import advertisementModels, { AdType } from "../advertisement.model";
import { createCampaignAdDisplayPeriods } from "./getDisplayPeriods";

type DenerateDailyDisplayPeriods = {
    _id: string;
    startDate: string;
    endDate: string;
    ads: {
        _id: string;
        bidAmount: AdType["bidAmount"];
        budgetAllocation: AdType["budgetAllocation"];
        event: AdType["event"];
        nextPeriodGenerationDates: AdType["nextPeriodGenerationDates"];
    }[]
}

const generateDailyDisplayPeriods = async () => {
    const currentTime = new Date(Date.now());

    const aggregateData: DenerateDailyDisplayPeriods[] = await advertisementModels.Campaign.aggregate([
        {
            // find daily active campaigns
            $match: {
                status: "active",
                budgetType: "daily",
                $and: [
                    { startDate: { $lte: currentTime } },
                    { endDate: { $gte: currentTime } },
                ]
            }
        },
        {
            $lookup: {
                from: "ads",
                localField: "ads",
                foreignField: "_id",
                as: "ads"
            }
        },
        {
            // get active ads
            $addFields: {
                activeAds: {
                    $filter: {
                        input: "$ads",
                        as: "ad",
                        cond: {
                            $and: [
                                { $eq: ["$$ad.status", "active"] },
                            ]
                        }
                    }
                }
            }
        },
        {
            // get active ads that are ready for next period generation 
            $addFields: {
                ads: {
                    $filter: {
                        input: "$activeAds",
                        as: "ad",
                        cond: {
                            $lte: [{ $arrayElemAt: ["$$ad.nextPeriodGenerationDates", -1] }, currentTime]
                        }
                    }
                }
            }
        },
        {
            // get only active ads that are not empty
            $match: {
                ads: { $ne: [] }
            }
        },
        {
            $project: {
                _id: 1,
                startDate: 1,
                endDate: 1,
                "ads._id": 1,
                "ads.bidAmount": 1,
                "ads.budgetAllocation": 1,
                "ads.event": 1,
                "ads.nextPeriodGenerationDates": 1
            }
        }
    ]);

    return aggregateData
}

const getUpdateAdsData = async () => {
    const displayPeriods = await generateDailyDisplayPeriods();

    const updates: mongoose.mongo.AnyBulkWriteOperation<AdType>[] = [];

    displayPeriods.forEach(campaign => {
        campaign.ads.forEach(ad => {
            const periods = createCampaignAdDisplayPeriods({
                campaign: {
                    budgetType: "daily",
                    startDate: new Date(Date.now()),
                    endDate: new Date(campaign.endDate)
                },
                ad: {
                    bidAmount: ad.bidAmount,
                    event: ad.event,
                    budgetAllocation: ad.budgetAllocation
                }
            });

            const nextPeriod = new Date(new Date(Date.now()).getTime() + 24 * 60 * 60 * 1000);
            const nextPeriodGenerationDates = [...ad.nextPeriodGenerationDates, nextPeriod];

            const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
                updateOne: {
                    filter: {
                        _id: new mongoose.Types.ObjectId(ad._id)
                    },
                    update: {
                        $set: {
                            displayPeriods: periods,
                            nextPeriodGenerationDates
                        }
                    }
                }
            }

            updates.push(bulkWrite);
        });
    });

    return updates;
}

export default getUpdateAdsData;