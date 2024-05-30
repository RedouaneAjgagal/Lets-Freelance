import { GetContractCancellationType } from "../services/getContractCancellations";
import ContractCancellationAboutJob from "./ContractCancellationAboutJob";
import ContractCancellationAboutService from "./ContractCancellationAboutService";

type ContractCancellationAboutActivityProps = {
    contract: GetContractCancellationType;
}

const ContractCancellationAboutActivity = (props: React.PropsWithoutRef<ContractCancellationAboutActivityProps>) => {
    return (
        <article className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-purple-800">About the {props.contract.activityType}</h3>
            {props.contract.activityType === "job"
                ? <ContractCancellationAboutJob jobContract={props.contract.job} />
                : <ContractCancellationAboutService serviceContract={props.contract.service} />
            }
        </article>
    )
}

export default ContractCancellationAboutActivity