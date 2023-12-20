import dbConnection from "../../../db/dbConnection";

import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import { advertisementModels } from "..";

import seedAdsValues from ".";


const deleteAdvertisementDocuments = async () => {
    const deletedCampaigns = await advertisementModels.Campaign.deleteMany({ name: seedAdsValues.testValue });
    const deletedAds = await advertisementModels.Ad.deleteMany({ country: seedAdsValues.testValue });
    console.log({ deletedCampaigns, deletedAds });
}

deleteAdvertisementDocuments();


const start = async () => {
    try {
        await dbConnection(process.env.MONGO_URI!);
    } catch (error) {
        console.log(error);
    }
}

start();