import { Link } from "react-router-dom";
import ContractStatus from "../../../components/ContractStatus";
import { GetContractCancellationType } from "../services/getContractCancellations";

type ContractCancellationGeneralInfoProps = {
    contractId: GetContractCancellationType["_id"];
    activityType: GetContractCancellationType["activityType"];
    activityId: string;
    freelancer: GetContractCancellationType["freelancer"];
    employer: GetContractCancellationType["employer"];
}

const ContractCancellationGeneralInfo = (props: React.PropsWithoutRef<ContractCancellationGeneralInfoProps>) => {

    return (
        <article className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-purple-800">General info</h3>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <h5 className="font-medium">Contract:</h5>
                    <span className="text-slate-600">{props.contractId}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">Activity:</span>
                    <Link className="underline capitalize" to={`/${props.activityType}s/${props.activityId}`} target="_blank" rel="noopener noreferrer">{props.activityType}</Link>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Link className="underline" to={`/profiles/${props.freelancer.profile}`} target="_blank" rel="noopener noreferrer">Freelancer</Link>
                            <div className="self-start">
                                <ContractStatus status={props.freelancer.status} />
                            </div>
                        </div>
                        <div className="flex  items-center gap-2">
                            <Link className="underline" to={`/profiles/${props.employer.profile}`} target="_blank" rel="noopener noreferrer">Employer</Link>
                            <div className="self-start">
                                <ContractStatus status={props.employer.status} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default ContractCancellationGeneralInfo