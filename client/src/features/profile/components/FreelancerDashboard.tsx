import Loading from "../../../components/Loading";
import useFreelancerReportsQuery from "../hooks/useFreelancerReportsQuery"
import FreelancerDashboardConnect from "./FreelancerDashboardConnect";
import FreelancerDashboardJob from "./FreelancerDashboardJob";
import FreelancerDashboardProposal from "./FreelancerDashboardProposal";
import FreelancerDashboardService from "./FreelancerDashboardService";

const FreelancerDashboard = () => {
    const freelancerReports = useFreelancerReportsQuery();

    return (
        freelancerReports.isLoading ?
            <Loading type="statements" numOfCards={6} />
            :
            <section className="flex flex-col gap-12">
                <FreelancerDashboardService serviceDetails={freelancerReports.data!.service} />
                <FreelancerDashboardJob jobDetails={freelancerReports.data!.job} />
                <FreelancerDashboardProposal proposalDetails={freelancerReports.data!.proposal} />
                <FreelancerDashboardConnect connectDetails={freelancerReports.data!.connect} />
            </section>
    )
}

export default FreelancerDashboard