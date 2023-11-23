import { AdType, CampaignType, DisplayPeriod } from "../advertisement.model"

type DisplayPeriods = {
    campaignAd: {
        displayPeriods: AdType["displayPeriods"];
        bidAmount: AdType["bidAmount"];
        budgetAllocation: AdType["budgetAllocation"];
        event: AdType["event"];
    }
    campaign: {
        startDate: CampaignType["startDate"];
        endDate: CampaignType["endDate"];
        budgetType: CampaignType["budgetType"];
    }
}

type CreateCampaignAdDisplayPeriods = {
    campaign: {
        budgetType: CampaignType["budgetType"];
        startDate: CampaignType["startDate"];
        endDate: CampaignType["endDate"];
    }
    ad: {
        bidAmount: AdType["bidAmount"];
        event: AdType["event"];
        budgetAllocation: AdType["budgetAllocation"];
    }
}

type DisplayAmountType = {
    displayAmount: number;
    campaignBudgetType: CampaignType["budgetType"];
    startDate: Date;
    endDate: Date;
}

type GetDisplayAmount = {
    bidAmount: AdType["bidAmount"];
    event: AdType["event"];
    budgetAllocation: AdType["budgetAllocation"];
}

type CpcDisplayBoost = {
    type: "percent" | "fix";
    value: number;
};

const cpcDisplayBoost: CpcDisplayBoost = {
    type: "percent",
    value: 30
}

const getDisplayAmount = ({ bidAmount, budgetAllocation, event }: GetDisplayAmount): number => {
    let displayAmount = budgetAllocation! / bidAmount;
    if (event === "cpc") {
        const getCpcInitialBoost = cpcDisplayBoost.type === "percent" ? budgetAllocation! / 100 * cpcDisplayBoost.value : budgetAllocation! + cpcDisplayBoost.value;
        const cpcBoost = getCpcInitialBoost / bidAmount;
        displayAmount += cpcBoost;
    }
    return Math.ceil(displayAmount);
}

const generateDisplayPeriods = ({ displayAmount, startDate, endDate, campaignBudgetType }: DisplayAmountType) => {
    const displayPeriods: DisplayPeriod[] = [];

    const oneDayTime = 24 * 60 * 60 * 1000; // 24 hours
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    const periodTime = campaignBudgetType === "daily" ? oneDayTime : (new Date(endTime).getTime() - startTime.getTime());

    const END_TIME_PERIOD = 5 * 60 * 1000; // 5 min

    const getTimeForEachDisplay = periodTime / displayAmount;

    for (let i = 0; i < displayAmount; i++) {
        const startOfPeriodTime = ((i + 1) * getTimeForEachDisplay) - getTimeForEachDisplay;
        const generateTime = startOfPeriodTime + (Math.random() * getTimeForEachDisplay);

        const start = new Date(startTime.getTime() + generateTime);
        const end = new Date(start.getTime() + END_TIME_PERIOD);

        displayPeriods.push({
            startTime: start,
            endTime: end
        });
    }

    return displayPeriods;
}

export const createCampaignAdDisplayPeriods = ({ campaign, ad }: CreateCampaignAdDisplayPeriods): DisplayPeriod[] => {
    const displayAmount = getDisplayAmount({
        bidAmount: ad.bidAmount,
        budgetAllocation: ad.budgetAllocation,
        event: ad.event
    });

    const displayPeriods = generateDisplayPeriods({
        campaignBudgetType: campaign.budgetType,
        endDate: campaign.endDate,
        startDate: campaign.startDate,
        displayAmount
    });

    return displayPeriods;
}

const getDisplayPeriods = ({ campaignAd, campaign }: DisplayPeriods) => {
    const currentTime = new Date(Date.now()).getTime();
    const alreadyDisplayedAds = campaignAd.displayPeriods!.filter(ad => new Date(ad.endTime).getTime() < currentTime);
    const campaignAlreadyStarted = new Date(campaign.startDate).getTime() < currentTime;

    const displayAmount = getDisplayAmount({
        bidAmount: campaignAd.bidAmount!,
        budgetAllocation: campaignAd.budgetAllocation!,
        event: campaignAd.event!
    });

    const adPeriods = generateDisplayPeriods({
        displayAmount: displayAmount - alreadyDisplayedAds.length,
        campaignBudgetType: campaign.budgetType,
        endDate: campaign.endDate,
        startDate: campaignAlreadyStarted ? new Date(Date.now()) : campaign.startDate
    });

    const displayPeriods = [...alreadyDisplayedAds, ...adPeriods];

    return displayPeriods;
}

export default getDisplayPeriods;