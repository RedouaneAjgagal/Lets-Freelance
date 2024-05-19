import { useState } from "react";
import useAdsAnalyticsQuery from "../../hooks/useAdsAnalyticsQuery"
import { AdsAnalyticsPayload } from "../../services/adsAnalytics";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { useQueryClient } from "@tanstack/react-query";
import CreatedAdSetsAnalytics from "./CreatedAdSetsAnalytics";
import StatusAdsAnalytics from "./StatusAdsAnalytics";
import AdSetsEventsAnalytics from "./AdSetsEventsAnalytics";
import AdSetsBidAmountAnalytics from "./AdSetsBidAmountAnalytics";
import AdSetsMadeOrdersAnalytics from "./AdSetsMadeOrdersAnalytics";
import AdSetsDisplayingNowAnalytics from "./AdSetsDisplayingNowAnalytics";


const AdSetsAnalyticsContainer = () => {
    const queryClient = useQueryClient();

    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const adsAnalyticsPayload: AdsAnalyticsPayload = {};

    if (filterBy !== "all") {
        adsAnalyticsPayload.created_ad_duration = filterBy;
    };

    const adsAnalyticsQuery = useAdsAnalyticsQuery(adsAnalyticsPayload);


    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["adsAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Ad sets overview" />
            </div>
            <CreatedAdSetsAnalytics ads={adsAnalyticsQuery.data?.durationAds} filterBy={filterBy} isLoading={adsAnalyticsQuery.isLoading} totalAds={adsAnalyticsQuery.data?.totalAds} title={`Created ad sets ${formatedTitle}`} />
            <StatusAdsAnalytics ads={adsAnalyticsQuery.data?.statusAds} isLoading={adsAnalyticsQuery.isLoading} title={`Ad set status ${formatedTitle}`} />
            <AdSetsEventsAnalytics ads={adsAnalyticsQuery.data?.events} isLoading={adsAnalyticsQuery.isLoading} title={`Ad set events ${formatedTitle}`} />
            <AdSetsBidAmountAnalytics ads={adsAnalyticsQuery.data?.bidAmounts} isLoading={adsAnalyticsQuery.isLoading} title={`Ad set bid amounts ${formatedTitle}`} />
            <AdSetsDisplayingNowAnalytics ads={adsAnalyticsQuery.data?.isDisplayingNow} isLoading={adsAnalyticsQuery.isLoading} title={`Ad set in view ${formatedTitle}`} />
            <AdSetsMadeOrdersAnalytics ads={adsAnalyticsQuery.data?.madeOrders} isLoading={adsAnalyticsQuery.isLoading} title={`Ad set conversions ${formatedTitle}`} />
        </div>
    )
}

export default AdSetsAnalyticsContainer