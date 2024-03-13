import { useParams } from "react-router-dom"
import { SubmitWorkedHoursForm, useContractQuery } from "../../features/contract";
import { useAppSelector } from "../../hooks/redux";
import Loading from "../../components/Loading";


const SubmitWorkedHours = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const { contractId } = useParams();

    const contractQuery = useContractQuery();

    if (contractQuery.isSuccess && !contractQuery.isLoading) {
        // if contract doesnt belong to the freelancer
        if (contractQuery.data.freelancer.profile !== userInfo!.profileId) {
            throw new Error("Unauthorized action");
        }

        // if contract is not job contract
        if (contractQuery.data.activityType !== "job") {
            throw new Error("Unable to submit worked hours..");
        }
    }

    return (
        <main className="p-4 flex flex-col gap-4">
            <h1 className="font-semibold text-xl">Submit worked hours</h1>
            <div className="flex flex-col gap-2">
                <small>Contract ID: {contractId}</small>
                {contractQuery.isLoading ?
                    <Loading />
                    : contractQuery.data!.activityType === "job" ?
                        <SubmitWorkedHoursForm hourlyPrice={contractQuery.data!.job.price} contractId={contractQuery.data!._id} />
                        : <p>Unable to submit worked hours..</p>
                }
            </div>
        </main>
    )
}

export default SubmitWorkedHours