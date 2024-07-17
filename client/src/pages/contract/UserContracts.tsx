import { useSearchParams } from "react-router-dom"
import { FilterContracts, UserContractsContainer, UserContractsQuery, useGetUserContractsQuery } from "../../features/contract"
import Loading from "../../components/Loading";

const UserContracts = () => {
    const [URLSearchParams] = useSearchParams();

    const contractQueries: UserContractsQuery = {};

    const status = URLSearchParams.get("status");

    const validStatusTypes = ["inProgress", "completed", "canceled"];
    if (status && validStatusTypes.includes(status)) {
        contractQueries.status = status as UserContractsQuery["status"];
    }

    const job_id = URLSearchParams.get("job_id");
    if (job_id && job_id.toString() !== "") {
        contractQueries.job_id = job_id;
    }

    const service_id = URLSearchParams.get("service_id");
    if (service_id && service_id.toString() !== "") {
        contractQueries.service_id = service_id;
    }

    const getUserContractsQuery = useGetUserContractsQuery(contractQueries);


    const isSpecificContracts = (
        getUserContractsQuery.isSuccess
        && getUserContractsQuery.data.length
        && (contractQueries.job_id || contractQueries.service_id)
    ) ? true : false;

    let activityTitle: string | undefined;

    if (isSpecificContracts) {
        activityTitle = getUserContractsQuery.data![0].activityType === "job" ? getUserContractsQuery.data![0].job.title : getUserContractsQuery.data![0].service.title;
    }


    return (
        <main className="p-4 flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-purple-800 leading-tight">My contracts</h1>
            <FilterContracts contractQueries={contractQueries} isSpecificContracts={isSpecificContracts} activityTitle={activityTitle} />
            {getUserContractsQuery.isLoading ?
                <Loading type="table" />
                : <UserContractsContainer contracts={getUserContractsQuery.data!} />
            }
        </main>
    )
}

export default UserContracts