import { CampaignType } from "../advertisement.model";

type CalcDailyBudgetAllocation = {
    ads: CampaignType["ads"];
    campaignBudget: number;
}

const calcDailyBudgetAllocation = ({ ads, campaignBudget }: CalcDailyBudgetAllocation) => {
    const totalbidAmount = ads.reduce((num, ad) => {
        return num + ad.bidAmount!
    }, 0);

    const updatedAds = ads.map(ad => {
        const dailyBudgetAllocation = (ad.bidAmount! / totalbidAmount) * campaignBudget;
        ad.dailyBudgetAllocation = dailyBudgetAllocation;
        return ad
    });

    return updatedAds;
}

export default calcDailyBudgetAllocation;