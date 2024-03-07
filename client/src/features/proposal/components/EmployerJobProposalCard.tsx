import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals";
import EmployerJobProposalCoverLetter from "./EmployerJobProposalCoverLetter";
import EmployerJobProposalEstimatedTime from "./EmployerJobProposalEstimatedTime";
import EmployerJobProposalPrice from "./EmployerJobProposalPrice";
import EmployerJobProposalProfileCard from "./EmployerJobProposalProfileCard";
import EmployerJobProposalCtaStatus from "./EmployerJobProposalCtaStatus";
import EmployerJobProposalPostedAt from "./EmployerJobProposalPostedAt";

type EmployerJobProposalCardProps = {
    proposal: GetEmployerJobProposalType;
}

const EmployerJobProposalCard = (props: React.PropsWithoutRef<EmployerJobProposalCardProps>) => {
    return (
        <article className="py-4 border-t">
            <div className="p-4 flex flex-col gap-4">
                <EmployerJobProposalProfileCard avatar={props.proposal.profile.avatar} isBoostedProposal={props.proposal.isBoostedProposal} jobTitle={props.proposal.profile.roles.freelancer.jobTitle} name={props.proposal.profile.name} profileId={props.proposal.profile._id} />
                <EmployerJobProposalCoverLetter coverLetter={props.proposal.coverLetter} MAX_LENGTH={180} />
                <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1">
                    <EmployerJobProposalPrice price={props.proposal.price} priceType={props.proposal.priceType} />
                    <EmployerJobProposalEstimatedTime estimatedTime={props.proposal.estimatedTime} />
                </div>
                <EmployerJobProposalCtaStatus status={props.proposal.status} proposalId={props.proposal._id} contractId={props.proposal.contract?._id} />
                <EmployerJobProposalPostedAt createdAt={props.proposal.createdAt} />
            </div>
        </article>
    )
}

export default EmployerJobProposalCard