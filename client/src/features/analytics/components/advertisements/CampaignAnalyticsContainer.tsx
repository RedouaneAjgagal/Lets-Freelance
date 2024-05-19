import { useState } from "react";
import useCampaignAnalyticsQuery from "../../hooks/useCampaignAnalyticsQuery"
import { CampaignAnalyticsPayload } from "../../services/campaignAnalytics";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { useQueryClient } from "@tanstack/react-query";
import CreatedCampaignsAnalytics from "./CreatedCampaignsAnalytics";
import StatusCampaignsAnalytics from "./StatusCampaignsAnalytics";
import CampaignRangeAnalytics from "./CampaignRangeAnalytics";
import CampaignTypesAnalytics from "./CampaignTypesAnalytics";
import DailyBudgetCampaignsAnalytics from "./DailyBudgetCampaignsAnalytics";
import TotalBudgetCampaignsAnalytics from "./TotalBudgetCampaignsAnalytics";
import CampaignContainAdsAnalytics from "./CampaignContainAdsAnalytics";


const CampaignAnalyticsContainer = () => {
  const queryClient = useQueryClient();

  const [filterBy, setFilterBy] = useState<FilterValues>("week");

  const campaignAnalyticsPayload: CampaignAnalyticsPayload = {};

  if (filterBy !== "all") {
    campaignAnalyticsPayload.created_campaign_duration = filterBy;
  };

  const campaignAnalyticsQuery = useCampaignAnalyticsQuery(campaignAnalyticsPayload);

  const selectFilterHandler = (filterValue: FilterValues) => {
    setFilterBy(filterValue);

    queryClient.removeQueries({ queryKey: ["campaignAnalytics"] });
  }

  const durationNames = {
    day: "today",
    week: "last 7 days",
    month: "this month",
    year: "this year",
    all: ""
  };

  const formatedTitle = durationNames[filterBy];

  return (
    <div>
      <div className="mt-4">
        <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Campaigns overview" />
      </div>
      <CreatedCampaignsAnalytics campaigns={campaignAnalyticsQuery.data?.durationCampaigns} filterBy={filterBy} isLoading={campaignAnalyticsQuery.isLoading} totalCampaigns={campaignAnalyticsQuery.data?.totalCampaigns} title={`Created campaigns ${formatedTitle}`} />
      <StatusCampaignsAnalytics campaigns={campaignAnalyticsQuery.data?.statusCampaigns} isLoading={campaignAnalyticsQuery.isLoading} title={`Campaign status ${formatedTitle}`} />
      <CampaignRangeAnalytics campaigns={campaignAnalyticsQuery.data?.activeCampaignsRange} isLoading={campaignAnalyticsQuery.isLoading} title={`Active campaigns range ${formatedTitle}`} />
      <CampaignTypesAnalytics campaigns={campaignAnalyticsQuery.data?.campaignTypes} isLoading={campaignAnalyticsQuery.isLoading} title={`Campaigns types ${formatedTitle}`} />
      <DailyBudgetCampaignsAnalytics campaigns={campaignAnalyticsQuery.data?.dailyBudgetCampaigns} isLoading={campaignAnalyticsQuery.isLoading} title={`Daily budget campaigns ${formatedTitle}`} />
      <TotalBudgetCampaignsAnalytics campaigns={campaignAnalyticsQuery.data?.totalBudgetCampaigns} isLoading={campaignAnalyticsQuery.isLoading} title={`Total budget campaigns ${formatedTitle}`} />
      <CampaignContainAdsAnalytics campaigns={campaignAnalyticsQuery.data?.containAds} isLoading={campaignAnalyticsQuery.isLoading} title={`Campaigns contain ad sets ${formatedTitle}`} />
    </div>
  )
}

export default CampaignAnalyticsContainer