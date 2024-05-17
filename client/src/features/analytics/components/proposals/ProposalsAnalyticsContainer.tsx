import { useState } from "react";
import useProposalsAnalyticsQuery from "../../hooks/useProposalsAnalyticsQuery"
import { ProposalsAnalyticsPayload } from "../../services/proposalsAnalytics";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { useQueryClient } from "@tanstack/react-query";
import CreatedProposalsAnalytics from "./CreatedProposalsAnalytics";
import ProposalTypesAnalytics from "./ProposalTypesAnalytics";
import StatusProposalsAnalytics from "./StatusProposalsAnalytics";
import BoostedProposalsAnalytics from "./BoostedProposalsAnalytics";
import BoostedProposalsTypesAnalytics from "./BoostedProposalsTypesAnalytics";
import TopThreeBoostersAnalytics from "./TopThreeBoostersAnalytics";


const ProposalsAnalyticsContainer = () => {
    const queryClient = useQueryClient();

    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const proposalsPayload: ProposalsAnalyticsPayload = {};

    if (filterBy !== "all") {
        proposalsPayload.created_proposal_duration = filterBy;
    };

    const proposalsAnalyticsQuery = useProposalsAnalyticsQuery(proposalsPayload);

    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["proposalsAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Proposals overview" />
            </div>
            <CreatedProposalsAnalytics createdAtProposals={proposalsAnalyticsQuery.data?.postedAt} isLoading={proposalsAnalyticsQuery.isLoading} totalProposals={proposalsAnalyticsQuery.data?.totalProposals} title={`Created proposals ${formatedTitle}`} filterBy={filterBy} />
            <ProposalTypesAnalytics isLoading={proposalsAnalyticsQuery.isLoading} proposalsTypes={proposalsAnalyticsQuery.data?.proposalTypes} title={`Proposal types ${formatedTitle}`} />
            <StatusProposalsAnalytics isLoading={proposalsAnalyticsQuery.isLoading} statusProposals={proposalsAnalyticsQuery.data?.status} title={`Proposal status ${formatedTitle}`} />
            <BoostedProposalsAnalytics isLoading={proposalsAnalyticsQuery.isLoading} proposals={proposalsAnalyticsQuery.data?.boosters} title={`Boosted proposals ${formatedTitle}`} />
            <BoostedProposalsTypesAnalytics isLoading={proposalsAnalyticsQuery.isLoading} proposals={proposalsAnalyticsQuery.data?.boostersTypes} title={`Boosted proposal types`} />
            <TopThreeBoostersAnalytics isLoading={proposalsAnalyticsQuery.isLoading} topThreeBoosters={proposalsAnalyticsQuery.data?.topThreeBoosters} title={`Top three boosters ${formatedTitle}`} />
        </div>
    )
}

export default ProposalsAnalyticsContainer