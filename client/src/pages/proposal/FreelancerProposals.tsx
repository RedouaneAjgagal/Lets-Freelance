import Loading from "../../components/Loading";
import { useFreelancerProposalsQuery, FreelancerProposalsTable } from "../../features/proposal"


const FreelancerProposals = () => {
    const freelancerProposals = useFreelancerProposalsQuery();

    return (
        <main className="p-4 flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">My Proposals</h1>
            {
                freelancerProposals.isLoading ?
                    <Loading type="table" />
                    :
                    <FreelancerProposalsTable proposals={freelancerProposals.data!} />
            }
        </main>
    )
}

export default FreelancerProposals