import { SingleJobType } from "../../job";
import SubmitProposalForm from "./SubmitProposalForm";
import SubmitProposalJobDetails from "./SubmitProposalJobDetails";


type SubmitProposalContainerProps = {
    jobDetails: SingleJobType;
}

const SubmitProposalContainer = (props: React.PropsWithoutRef<SubmitProposalContainerProps>) => {
    return (
        <div className="flex flex-col gap-6 relative pb-16">
            <SubmitProposalJobDetails jobDetails={props.jobDetails} />
            <SubmitProposalForm jobId={props.jobDetails._id} price={props.jobDetails.price} priceType={props.jobDetails.priceType} duration={props.jobDetails.duration} />
        </div>
    )
}

export default SubmitProposalContainer