import { useSearchParams } from "react-router-dom"
import { UserContractsQuery, useGetUserContractsQuery } from "../../features/contract"
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

    return (
        <main className="p-4 flex flex-col gap-6 bg-purple-100/30">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">My Contracts</h1>
            {getUserContractsQuery.isLoading ?
                <Loading />
                : <div>{getUserContractsQuery.data?.length}</div>
            }
        </main>
    )
}

export default UserContracts