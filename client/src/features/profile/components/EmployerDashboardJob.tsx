import { EmployerReportsType } from "../services/getEmployerReports";
import DashboardCard from "./DashboardCard";

type EmployerDashboardJobType = {
    jobDetails: EmployerReportsType["job"];
}


const EmployerDashboardJob = (props: React.PropsWithoutRef<EmployerDashboardJobType>) => {
    const serviceDetails = [
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
        <article className="flex flex-col gap-2">
            <h2 className="text-xl text-slate-800 font-semibold">Jobs</h2>
            <ul className="flex flex-col flex-wrap gap-4">
                {serviceDetails.map((service, index) => <DashboardCard cardTitle={service.title} value={service.value} iconUrl={service.iconUrl} key={index} />)}
            </ul>
        </article>
    )
}

export default EmployerDashboardJob