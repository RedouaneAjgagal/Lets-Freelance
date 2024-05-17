import { useState } from "react"
import useJobAnalyticsQuery from "../../hooks/useJobAnalyticsQuery"
import ChartsNavbar, { FilterValues } from "../ChartsNavbar"
import { JobsAnalyticsPayload } from "../../services/jobsAnalytics";
import { useQueryClient } from "@tanstack/react-query";
import CreatedJobsAnalytics from "./CreatedJobsAnalytics";
import JobTypesAnalytics from "./JobTypesAnalytics";
import HourlyJobsAnalytics from "./HourlyJobsAnalytics";
import FixedJobsAnalytics from "./FixedJobsAnalytics";


const JobsAnalyticsContainer = () => {
    const queryClient = useQueryClient();

    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const jobAnalyticsPayload: JobsAnalyticsPayload = {};

    if (filterBy !== "all") {
        jobAnalyticsPayload.created_job_duration = filterBy;
    };

    const jobAnalyticsQuery = useJobAnalyticsQuery(jobAnalyticsPayload);

    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["jobAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Jobs overview" />
            </div>
            <CreatedJobsAnalytics title={`Created jobs ${formatedTitle}`} createdJobs={jobAnalyticsQuery.data?.postedAt} totalJobs={jobAnalyticsQuery.data?.totalJobs} isLoading={jobAnalyticsQuery.isLoading} filterBy={filterBy} />
            <JobTypesAnalytics isLoading={jobAnalyticsQuery.isLoading} jobTypes={jobAnalyticsQuery.data?.jobTypes} totalJobs={jobAnalyticsQuery.data?.totalDurationJobs} title={`Job types ${formatedTitle}`} />
            <HourlyJobsAnalytics hourlyJobs={jobAnalyticsQuery.data?.hourlyJobs} isLoading={jobAnalyticsQuery.isLoading} totalHourlyJobs={jobAnalyticsQuery.data?.totalHourlyJobs} title={`Hourly jobs budget ${formatedTitle}`} />
            <FixedJobsAnalytics fixedJobs={jobAnalyticsQuery.data?.fixedJobs} isLoading={jobAnalyticsQuery.isLoading} totalFixedJobs={jobAnalyticsQuery.data?.totalFixedJobs} title={`Fixed jobs budget ${formatedTitle}`} />
        </div>
    )
}

export default JobsAnalyticsContainer