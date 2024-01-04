import { EmployerReportsType } from "../services/getEmployerReports"
import DashboardCard from "./DashboardCard";

type EmployerDashboardTotalSpentProps = {
    totalSpentDetails: EmployerReportsType["totalSpent"];
}

const EmployerDashboardTotalSpent = (props: React.PropsWithoutRef<EmployerDashboardTotalSpentProps>) => {
    const serviceDetails = [
        {
            title: "Spent On Jobs",
            value: props.totalSpentDetails.spentOnJobs,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/1001/1001371.png"
        },
        {
            title: "Spent On Services",
            value: props.totalSpentDetails.spentOnServices,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/3247/3247170.png"
        },
        {
            title: "Refunded",
            value: props.totalSpentDetails.refunded,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/5868/5868585.png"
        }
    ];

    return (
        <article className="flex flex-col gap-2">
            <h2 className="text-xl text-slate-800 font-semibold">Total Spent</h2>
            <ul className="flex flex-col flex-wrap gap-4">
                {serviceDetails.map((service, index) => <DashboardCard cardTitle={service.title} value={service.value} iconUrl={service.iconUrl} key={index} />)}
            </ul>
        </article>
    )
}

export default EmployerDashboardTotalSpent