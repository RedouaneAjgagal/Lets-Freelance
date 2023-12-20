import dbConnection from "../../../db/dbConnection";

import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";

import mongoose from "mongoose";
import { advertisementModels } from "..";
import { AdType, CampaignType } from "../advertisement.model";
import { createCampaignAdDisplayPeriods } from "../display_periods/getDisplayPeriods";

const adsDetails: { ids: mongoose.Types.ObjectId[]; campaignBudget: number; }[] = [];

const insertedCampaigns: CampaignType[] = [];


import seedAdsValues from ".";

const createAdvertisementDocuments = async () => {

    for (let i = 0; i < seedAdsValues.documentsCount; i++) {
        const oneDayAhead = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const ads: AdType[] = [
            {
                user: new mongoose.Types.ObjectId("650208fc18049ba3425dffeb"),
                service: new mongoose.Types.ObjectId("6540378d493ec810e84277d3"),
                status: "active",
                budgetAllocation: 3,
                budgetAllocationCompleted: false,
                bidAmount: Math.random() + 0.1,
                event: Math.random() < 0.5 ? "cpm" : "cpc",
                category: "programming & tech",
                keywords: [
                    "react",
                    "mern stack",
                    "fullstack",
                    "frontend developer",
                    "backend developer"
                ],
                country: seedAdsValues.testValue,
                displayPeriods: [],
                nextPeriodGenerationDates: [oneDayAhead],
                amounts: [],
                budgetAllocationSpend: 0,
                orders: [],
            },
            {
                user: new mongoose.Types.ObjectId("650208fc18049ba3425dffeb"),
                service: new mongoose.Types.ObjectId("6540378d493ec810e84277d3"),
                status: "active",
                budgetAllocation: 3,
                budgetAllocationCompleted: false,
                bidAmount: Math.random() + 0.1,
                event: Math.random() < 0.5 ? "cpm" : "cpc",
                category: "design & creative",
                keywords: [
                    "design",
                    "logo",
                    "illustration",
                    "ui/ux",
                    "figma designer",
                    "design landing page"
                ],
                country: seedAdsValues.testValue,
                displayPeriods: [],
                nextPeriodGenerationDates: [oneDayAhead],
                amounts: [],
                budgetAllocationSpend: 0,
                orders: [],
            },
            {
                user: new mongoose.Types.ObjectId("650208fc18049ba3425dffeb"),
                service: new mongoose.Types.ObjectId("6540378d493ec810e84277d3"),
                status: "active",
                budgetAllocation: 3,
                budgetAllocationCompleted: false,
                bidAmount: Math.random() + 0.1,
                event: Math.random() < 0.5 ? "cpm" : "cpc",
                category: "writing & translation",
                keywords: [
                    "translate",
                    "seo",
                    "writing",
                    "blog",
                    "search engine optimization",
                    "language translator"
                ],
                country: seedAdsValues.testValue,
                displayPeriods: [],
                nextPeriodGenerationDates: [oneDayAhead],
                amounts: [],
                budgetAllocationSpend: 0,
                orders: [],
            },
            {
                user: new mongoose.Types.ObjectId("650208fc18049ba3425dffeb"),
                service: new mongoose.Types.ObjectId("6540378d493ec810e84277d3"),
                status: "active",
                budgetAllocation: 3,
                budgetAllocationCompleted: false,
                bidAmount: Math.random() + 0.1,
                event: Math.random() < 0.5 ? "cpm" : "cpc",
                category: "video & animation",
                keywords: [
                    "blender",
                    "animation",
                    "video editing"
                ],
                country: seedAdsValues.testValue,
                displayPeriods: [],
                nextPeriodGenerationDates: [oneDayAhead],
                amounts: [],
                budgetAllocationSpend: 0,
                orders: [],
            },
        ]

        const campaigns: CampaignType[] = [
            {
                user: new mongoose.Types.ObjectId("650208fc18049ba3425dffeb"),
                status: "active",
                name: seedAdsValues.testValue,
                budget: Math.floor(Math.random() * 20) + 5,
                budgetType: "daily",
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                ads: [],
                payments: []
            },
            {
                user: new mongoose.Types.ObjectId("650208fc18049ba3425dffeb"),
                status: "active",
                name: seedAdsValues.testValue,
                budget: Math.floor(Math.random() * 80) + 20,
                budgetType: "total",
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                ads: [],
                payments: []
            }
        ]

        const getTotalbidAmount = ads.reduce((num, ad) => {
            return ad.bidAmount + num;
        }, 0);

        const campaign = campaigns[i % 2];

        for (let i = 0; i < ads.length; i++) {
            const budgetAllocation = (ads[i].bidAmount / getTotalbidAmount) * campaign.budget;
            const displayPeriods = createCampaignAdDisplayPeriods({
                ad: {
                    bidAmount: ads[i].bidAmount,
                    budgetAllocation,
                    event: ads[i].event
                },
                campaign: {
                    budgetType: campaign.budgetType,
                    endDate: campaign.endDate,
                    startDate: campaign.startDate
                }
            });

            ads[i].budgetAllocation = budgetAllocation;
            ads[i].displayPeriods = displayPeriods;
        }

        console.log(`creating ads num ${i}`);

        const insertedAds = await advertisementModels.Ad.insertMany(ads);
        adsDetails.push({ ids: insertedAds.map(ad => ad._id), campaignBudget: campaign.budget });
    }

    for (let i = 0; i < seedAdsValues.documentsCount; i++) {
        const campaigns: CampaignType[] = [
            {
                user: new mongoose.Types.ObjectId("650208fc18049ba3425dffeb"),
                status: "active",
                name: seedAdsValues.testValue,
                budget: Math.floor(Math.random() * 20) + 5,
                budgetType: "daily",
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                ads: [],
                payments: []
            },
            {
                user: new mongoose.Types.ObjectId("650208fc18049ba3425dffeb"),
                status: "active",
                name: seedAdsValues.testValue,
                budget: Math.floor(Math.random() * 80) + 20,
                budgetType: "total",
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                ads: [],
                payments: []
            }
        ]

        insertedCampaigns.push({ ...campaigns[i % 2], budget: adsDetails[i].campaignBudget, ads: adsDetails[i].ids });

    }

    console.log("Creating campaigns");
    await advertisementModels.Campaign.insertMany(insertedCampaigns);

    console.log("DONE");
}

createAdvertisementDocuments();

const start = async () => {
    try {
        await dbConnection(process.env.MONGO_URI!);
    } catch (error) {
        console.log(error);
    }
}

start();