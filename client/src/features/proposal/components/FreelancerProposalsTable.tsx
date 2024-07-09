import TableHead from "../../../components/TableHead";
import { FreelancerProposalsType } from "../service/getFreelancerProposals";
import FreelancerProposalTable from "./FreelancerProposalTable";

type FreelancerProposalsProps = {
    proposals: FreelancerProposalsType;
};

const FreelancerProposalsTable = (props: React.PropsWithoutRef<FreelancerProposalsProps>) => {

    const tableHeads = ["Job", "Price", "Boost Proposal", "Submitted At", "Status", "Actions"];

    return (
        <section className='bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2'>
            {
                props.proposals.length ?
                    <table className="text-left w-full">
                        <TableHead tableHeads={tableHeads} width="wide" />
                        <tbody>
                            {
                                props.proposals.map(proposal => <FreelancerProposalTable key={proposal._id} proposal={proposal} />)
                            }
                        </tbody>
                    </table>
                    :
                    <>
                        <h2 className="text-xl font-medium">Empty..</h2>
                        <p className="text-slate-500">You haven't submitted any proposal yet.</p>
                    </>
            }
        </section>
    )
}

export default FreelancerProposalsTable