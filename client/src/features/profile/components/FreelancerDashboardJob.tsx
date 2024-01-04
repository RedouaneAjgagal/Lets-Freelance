import { FreelnacerReportsType } from "../services/getFreelancerReports"
import DashboardCardContainer from "./DashboardCardContainer";

type FreelancerDashboardJobProps = {
    jobDetails: FreelnacerReportsType["job"];
}

const FreelancerDashboardJob = (props: React.PropsWithoutRef<FreelancerDashboardJobProps>) => {

    const jobDetails = [
        {
            title: "In Queue Jobs",
            value: props.jobDetails.inQueueJobs,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/7154/7154465.png"
        },
        {
            title: "Completed Jobs",
            value: props.jobDetails.completedJobs,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/10610/10610477.png"
        },
        {
            title: "Jobs Revenue",
            value: `$${props.jobDetails.jobsRevenue.toFixed(2)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/1421/1421362.png"
        }
    ]

    return (
        <DashboardCardContainer cardsDetails={jobDetails} sectionTitle="Jobs" />
    )
}

export default FreelancerDashboardJob