import { Link } from "react-router-dom";
import ContractStatus from "../../../components/ContractStatus";
import { GetContractCancellationType } from "../services/getContractCancellations";
import formatDate from "../../../utils/formatDate";

type ContractGeneralInfoType = {
    contractId: string;
    activityType: "service" | "job";
    activityId: string;
    createdAt: string;
};

type ContractGeneralInfoWithUsersType = {
    usersInfo?: true;
    freelancer: GetContractCancellationType["freelancer"];
    employer: GetContractCancellationType["employer"];
} & ContractGeneralInfoType;

type ContractGeneralInfoWithoutUsersType = {
    usersInfo?: false;
} & ContractGeneralInfoType;

const ContractGeneralInfo = (props: React.PropsWithoutRef<ContractGeneralInfoWithUsersType | ContractGeneralInfoWithoutUsersType>) => {

    const createdAt = formatDate(props.createdAt);

    return (
        <article className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-purple-800">General info</h3>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <h5 className="font-medium">Contract ID:</h5>
                    <span className="text-slate-600">{props.contractId}</span>
                </div>
                <div className="flex flex-col">
                    <h5 className="font-medium">Created at:</h5>
                    <span className="text-slate-600">{createdAt}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">Activity:</span>
                    <Link className="underline capitalize" to={`/${props.activityType}s/${props.activityId}`} target="_blank" rel="noopener noreferrer">{props.activityType}</Link>
                </div>
                {props.usersInfo
                    ? <div className="flex flex-col">
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
                    : null
                }
            </div>
        </article>
    )
}

export default ContractGeneralInfo