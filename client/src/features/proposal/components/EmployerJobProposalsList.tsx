import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals"
import EmployerJobProposalCard from "./EmployerJobProposalCard";

type EmployerJobProposalsListProps = {
    proposals: GetEmployerJobProposalType[];
}

const EmployerJobProposalsList = (props: React.PropsWithoutRef<EmployerJobProposalsListProps>) => {
    return (
        <section>
            {props.proposals.map(proposal => <EmployerJobProposalCard key={proposal._id} proposal={proposal} />)}
        </section>
    )
}

export default EmployerJobProposalsList