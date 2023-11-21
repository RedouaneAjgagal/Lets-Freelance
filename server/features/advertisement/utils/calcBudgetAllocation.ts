import { CampaignType } from "../advertisement.model";

type CalcBudgetAllocation = {
    ads: CampaignType["ads"];
    campaignBudget: CampaignType["budget"];
}

const calcBudgetAllocation = ({ ads, campaignBudget }: CalcBudgetAllocation) => {
    const totalbidAmount = ads.reduce((num, ad) => {
        return num + ad.bidAmount!
    }, 0);

    const updatedAds = ads.map(ad => {
        const budgetAllocation = (ad.bidAmount! / totalbidAmount) * campaignBudget;
        ad.budgetAllocation = budgetAllocation;
        return ad
    });

    return updatedAds;
}

export default calcBudgetAllocation;