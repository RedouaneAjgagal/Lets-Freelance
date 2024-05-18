import { useState } from "react"
import ChartsNavbar, { FilterValues } from "../ChartsNavbar"
import useContractAnalyticsQuery from "../../hooks/useContractAnalyticsQuery";
import { ContractAnalyticsPayload } from "../../services/contractAnalytics";
import { useQueryClient } from "@tanstack/react-query";
import CreatedContractAnalytics from "./CreatedContractAnalytics";
import ContractTypesAnalytics from "./ContractTypesAnalytics";
import ContractStatusAnalytics from "./ContractStatusAnalytics";
import CancellationsContractsAnalytics from "./CancellationsContractsAnalytics";


const ContractsAnalyticsContainer = () => {
    const queryClient = useQueryClient();

    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const contractAnalyticsPayload: ContractAnalyticsPayload = {};

    if (filterBy !== "all") {
        contractAnalyticsPayload.created_contract_duration = filterBy;
    };

    const contractAnalyticsQuery = useContractAnalyticsQuery(contractAnalyticsPayload);

    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["contractAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Contracts overview" />
            </div>
            <CreatedContractAnalytics createdContracts={contractAnalyticsQuery.data?.createdContractsAt} isLoading={contractAnalyticsQuery.isLoading} totalContracts={contractAnalyticsQuery.data?.totalContracts} title={`Created contracts ${formatedTitle}`} filterBy={filterBy} />
            <ContractTypesAnalytics contractTypes={contractAnalyticsQuery.data?.contractTypes} isLoading={contractAnalyticsQuery.isLoading} title={`Submitted contract types ${formatedTitle}`} />
            <ContractStatusAnalytics contracts={contractAnalyticsQuery.data?.contractStatus} isLoading={contractAnalyticsQuery.isLoading} title={`Contract status ${formatedTitle}`} />
            <CancellationsContractsAnalytics contracts={contractAnalyticsQuery.data?.cancellations} isLoading={contractAnalyticsQuery.isLoading} title={`Cancellation contracts ${formatedTitle}`} />
        </div>
    )
}

export default ContractsAnalyticsContainer