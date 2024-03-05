import Loading from "../../components/Loading";
import { useEmployerJobProposalsQuery } from "../../features/proposal"


const EmployerJobProposals = () => {
    const employerJobProposals = useEmployerJobProposalsQuery();    

    return (
        employerJobProposals.isLoading ?
            <Loading />
            : <h1>Proposals length: {employerJobProposals.data?.length}</h1>
    )
}

export default EmployerJobProposals