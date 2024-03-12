import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux";
import { PrimaryButton } from "../../../layouts/brand";
import formatDate from "../../../utils/formatDate";
import { GetUserContractsReponse } from "../services/getUserSingleContract";
import ContractCancelRequest from "./ContractCancelRequest";
import ContractPayments from "./ContractPayments";
import ContractServiceInfo from "./ContractServiceInfo";
import ContractStatusInfo from "./ContractStatusInfo";
import SingleContractSectionWrapper from "./SingleContractSectionWrapper";
import ContractJobInfo from "./ContractJobInfo";

type ContractContainerProps = {
    contract: GetUserContractsReponse;
}

const ContractContainer = (props: React.PropsWithoutRef<ContractContainerProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const createdAt = formatDate(props.contract.createdAt);

    const aboutContract = props.contract.activityType === "service" ? (
        <SingleContractSectionWrapper sectionTitle="About contract" hasDate date={createdAt} dateTitle="Created At:">
            <ContractServiceInfo service={props.contract.service} />
        </SingleContractSectionWrapper>
    ) : (
        <SingleContractSectionWrapper sectionTitle="About contract" hasDate date={createdAt} dateTitle="Created At:">
            <ContractJobInfo job={props.contract.job} />
        </SingleContractSectionWrapper>
    );


    const completedAt = props.contract.completedAt ? formatDate(props.contract.completedAt) : "";

    const priceType = (props.contract.activityType === "job" && props.contract.job.priceType === "hourly") ? "hourly" : "fixed";

    const isCancelContract = !props.contract.cancelRequest.status && props.contract[userInfo!.userAs].status === "inProgress";

    const isCompleteContract = props.contract[userInfo!.userAs].status === "inProgress";

    const completeContractHandler = () => {
        if (!isCompleteContract) return;

        console.log(props.contract._id);
    }

    return (
        <div>
            <div className="mb-2">
                <small>Contract ID: {props.contract._id}</small>
            </div>
            <article className="flex flex-col gap-4">
                {aboutContract}
                <SingleContractSectionWrapper sectionTitle="Contract status" hasDate={props.contract.completedAt ? true : false} dateTitle="Completed At:" date={completedAt}>
                    <ContractStatusInfo freelancer={props.contract.freelancer} employer={props.contract.employer} />
                </SingleContractSectionWrapper>
                {props.contract.cancelRequest.status ?
                    <SingleContractSectionWrapper sectionTitle="Cancel request" hasDate={false}>
                        <ContractCancelRequest cancelRequest={props.contract.cancelRequest} freelancerStatus={props.contract.freelancer.status} employerStatus={props.contract.employer.status} />
                    </SingleContractSectionWrapper>
                    : null
                }
                <SingleContractSectionWrapper sectionTitle="Payments" hasDate={false}>
                    {props.contract.payments.length ?
                        <ContractPayments payments={props.contract.payments} priceType={priceType} />
                        : <p className="text-slate-600">Empty..</p>
                    }
                    {(priceType === "hourly" && userInfo!.userAs === "freelancer") ?
                        <Link to={`/`} className="self-start underline">Submit worked hours</Link>
                        : null
                    }
                </SingleContractSectionWrapper>
                <div className="flex items-center justify-end gap-x-4 gap-y-2 flex-wrap">
                    {isCancelContract ?
                        <Link to={`/`} className="text-sm font-medium text-slate-600 underline">Cancel contract</Link>
                        : null
                    }
                    {isCompleteContract ?
                        <PrimaryButton onClick={completeContractHandler} disabled={false} fullWith={false} justifyConent="center" style="solid" type="button" x="lg" y="md" >Complete contract</PrimaryButton>
                        : null
                    }
                </div>
            </article>
        </div>
    )
}

export default ContractContainer