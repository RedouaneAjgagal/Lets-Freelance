import { useState } from "react";
import useServicesAnalyticsQuery from "../../hooks/useServicesAnalyticsQuery"
import CreatedServicesAnalytics from "./CreatedServicesAnalytics";
import RatingServicesAnalytics from "./RatingServicesAnalytics";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { ServicesAnalyticsPayload } from "../../services/servicesAnalytics";
import { useQueryClient } from "@tanstack/react-query";


const ServicesAnalyticsContainer = () => {
    const queryClient = useQueryClient();

    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const serviceAnalyticsPayload: ServicesAnalyticsPayload = {};

    if (filterBy !== "all") {
        serviceAnalyticsPayload.created_service_duration = filterBy;
    };

    const servicesAnalyticsQuery = useServicesAnalyticsQuery({
        created_service_duration: filterBy === "all" ? undefined : filterBy
    });

    const selectFilterHandler = (filterBy: FilterValues) => {
        setFilterBy(filterBy);

        queryClient.removeQueries({ queryKey: ["servicesAnalytics"] });
    }

    const durationNames = {
        day: "today",
        week: "last 7 days",
        month: "this month",
        year: "this year",
        all: "overview"
    }

    const ratingServicesTitle = `Rating services ${durationNames[filterBy]}`

    return (
        <div className="grid gap-6">
            <div className="mt-2">
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Services overview" />
                <CreatedServicesAnalytics isLoading={servicesAnalyticsQuery.isLoading} totalServices={servicesAnalyticsQuery.data?.totalServices} createdServices={servicesAnalyticsQuery.data?.postedAt} filterBy={filterBy} />
            </div>
            {servicesAnalyticsQuery.data?.ratingServices.length
                ? <RatingServicesAnalytics title={ratingServicesTitle} isLoading={servicesAnalyticsQuery.isLoading} ratingServices={servicesAnalyticsQuery.data?.ratingServices} />
                : null
            }
        </div>
    )
}

export default ServicesAnalyticsContainer