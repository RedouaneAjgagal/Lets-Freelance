import { ContractCancellationJobType, ContractCancellationServiceType } from "../services/getContractCancellations";
import ContractCancellationAboutJob from "./ContractCancellationAboutJob";
import ContractCancellationAboutService from "./ContractCancellationAboutService";

type AboutActivityContractProps = {
    contract: {
        activityType: "service";
        service: ContractCancellationServiceType;
    } | {
        activityType: "job";
        job: ContractCancellationJobType;
    };
}

const AboutActivityContract = (props: React.PropsWithoutRef<AboutActivityContractProps>) => {
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

export default AboutActivityContract