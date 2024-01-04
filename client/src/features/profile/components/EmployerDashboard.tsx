import Loading from "../../../components/Loading";
import useEmployerReportsQuery from "../hooks/useEmployerReportsQuery"
import EmployerDashboardJob from "./EmployerDashboardJob";
import EmployerDashboardProposal from "./EmployerDashboardProposal";
import EmployerDashboardService from "./EmployerDashboardService";
import EmployerDashboardTotalSpent from "./EmployerDashboardTotalSpent";


const EmployerDashboard = () => {
  const employerReports = useEmployerReportsQuery();

  return (
    employerReports.isLoading ?
      <Loading />
      :
      <section className="flex flex-col gap-12">
        <EmployerDashboardJob jobDetails={employerReports.data!.job} />
        <EmployerDashboardService serviceDetails={employerReports.data!.service} />
        <EmployerDashboardProposal proposalDetails={employerReports.data!.proposal} />
        <EmployerDashboardTotalSpent totalSpentDetails={employerReports.data!.totalSpent} />
      </section>
  )
}

export default EmployerDashboard