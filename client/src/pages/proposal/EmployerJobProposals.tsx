import Loading from "../../components/Loading";
import { useEmployerJobProposalsQuery } from "../../features/proposal"


const EmployerJobProposals = () => {
    const employerJobProposals = useEmployerJobProposalsQuery();

    return (
        <main className="p-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">My Proposals</h1>
            {employerJobProposals.isLoading ? <Loading />
                : <h1>Proposals length: {employerJobProposals.data?.length}</h1>
            }
        </main>
    )
}

export default EmployerJobProposals