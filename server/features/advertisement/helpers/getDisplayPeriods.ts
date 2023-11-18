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

const getDisplayAmount = ({ bidAmount, dailyBudgetAllocation, event, totalBudgetAllocation, budgetType }: GetDisplayAmount): number => {
    const budgetAllocation = budgetType === "daily" ? dailyBudgetAllocation : totalBudgetAllocation;
    let displayAmount = budgetAllocation! / bidAmount;
    if (event === "cpc") {
        const getCpcInitialBoost = cpcDisplayBoost.type === "percent" ? budgetAllocation! / 100 * cpcDisplayBoost.value : budgetAllocation! + cpcDisplayBoost.value;
        const cpcBoost = getCpcInitialBoost / bidAmount;
        displayAmount += cpcBoost;
    }
    return Math.ceil(displayAmount);
}

const getDisplayPeriods = ({ campaign, ad }: GetDisplayPeriods): DisplayPeriod[] => {
    const displayAmount = getDisplayAmount({
        budgetType: campaign.budgetType,
        bidAmount: ad.bidAmount,
        dailyBudgetAllocation: ad.dailyBudgetAllocation,
        totalBudgetAllocation: ad.totalBudgetAllocation,
        event: ad.event
    });

    const displayPeriods: DisplayPeriod[] = [];

    const oneDayTime = 24 * 60 * 60 * 1000; // 24 hours
    const startTime = new Date(campaign.startDate);
    const endTime = new Date(campaign.endDate);

    const periodTime = campaign.budgetType === "daily" ? oneDayTime : (new Date(endTime).getTime() - startTime.getTime());

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

export default getDisplayPeriods;