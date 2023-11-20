import { AdType, CampaignType, DisplayPeriod } from "../advertisement.model"

type GetDisplayPeriods = {
    campaign: {
        budgetType: CampaignType["budgetType"];
        startDate: CampaignType["startDate"];
        endDate: CampaignType["endDate"];
    }
    ad: {
        bidAmount: AdType["bidAmount"];
        event: AdType["event"];
        dailyBudgetAllocation?: AdType["dailyBudgetAllocation"];
        totalBudgetAllocation?: AdType["totalBudgetAllocation"];
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
    dailyBudgetAllocation: AdType["dailyBudgetAllocation"];
    totalBudgetAllocation: AdType["totalBudgetAllocation"];
    budgetType: CampaignType["budgetType"];
}

type CpcDisplayBoost = {
    type: "percent" | "fix";
    value: number;
};

const cpcDisplayBoost: CpcDisplayBoost = {
    type: "percent",
    value: 30
}

export const getDisplayAmount = ({ bidAmount, dailyBudgetAllocation, event, totalBudgetAllocation, budgetType }: GetDisplayAmount): number => {
    const budgetAllocation = budgetType === "daily" ? dailyBudgetAllocation : totalBudgetAllocation;
    let displayAmount = budgetAllocation! / bidAmount;
    if (event === "cpc") {
        const getCpcInitialBoost = cpcDisplayBoost.type === "percent" ? budgetAllocation! / 100 * cpcDisplayBoost.value : budgetAllocation! + cpcDisplayBoost.value;
        const cpcBoost = getCpcInitialBoost / bidAmount;
        displayAmount += cpcBoost;
    }
    return Math.ceil(displayAmount);
}

export const generateDisplayPeriods = ({ displayAmount, startDate, endDate, campaignBudgetType }: DisplayAmountType) => {
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

const getDisplayPeriods = ({ campaign, ad }: GetDisplayPeriods): DisplayPeriod[] => {
    const displayAmount = getDisplayAmount({
        budgetType: campaign.budgetType,
        bidAmount: ad.bidAmount,
        dailyBudgetAllocation: ad.dailyBudgetAllocation,
        totalBudgetAllocation: ad.totalBudgetAllocation,
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

export default getDisplayPeriods;