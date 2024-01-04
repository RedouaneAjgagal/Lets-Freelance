import { EmployerReportsType } from "../services/getEmployerReports";
import DashboardCardContainer from "./DashboardCardContainer";

type EmployerDashboardJobType = {
    jobDetails: EmployerReportsType["job"];
}


const EmployerDashboardJob = (props: React.PropsWithoutRef<EmployerDashboardJobType>) => {
    const jobDetails = [
        {
            title: "Posted Jobs",
            value: props.jobDetails.postedJobs,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/2311/2311991.png"
        },
        {
            title: "InProgress Jobs",
            value: props.jobDetails.inProgressJobs,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/7154/7154465.png"
        },
        {
            title: "Completed Jobs",
            value: props.jobDetails.inProgressJobs,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/10610/10610477.png"
        }
    ];



    return (
        <DashboardCardContainer cardsDetails={jobDetails} sectionTitle="Jobs" />
    )
}

export default EmployerDashboardJob