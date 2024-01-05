import { useFreelancerProposalsQuery } from "../../features/proposal"

const FreelancerProposals = () => {
    const freelancerProposals = useFreelancerProposalsQuery();
    
    return (
        <div>FreelancerProposals</div>
    )
}

export default FreelancerProposals