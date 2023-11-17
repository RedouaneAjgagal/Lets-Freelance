import { CampaignType } from "../advertisement.model";

type CalcBudgetAllocation = {
    ads: CampaignType["ads"];
    campaignBudget: CampaignType["budget"];
    campaignBudgetType: CampaignType["budgetType"];
}

const calcBudgetAllocation = ({ ads, campaignBudget, campaignBudgetType }: CalcBudgetAllocation) => {
    const totalbidAmount = ads.reduce((num, ad) => {
        return num + ad.bidAmount!
    }, 0);

    const budgetAllocationType = campaignBudgetType === "daily" ? "dailyBudgetAllocation" : "totalBudgetAllocation";

    const updatedAds = ads.map(ad => {
        const budgetAllocation = (ad.bidAmount! / totalbidAmount) * campaignBudget;
        ad[budgetAllocationType] = budgetAllocation;
        return ad
    });

    return updatedAds;
}

export default calcBudgetAllocation;