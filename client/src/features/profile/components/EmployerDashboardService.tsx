import { EmployerReportsType } from "../services/getEmployerReports"
import DashboardCard from "./DashboardCard"

type EmployerDashboardServiceType = {
    serviceDetails: EmployerReportsType["service"];
}

const EmployerDashboardService = (props: React.PropsWithoutRef<EmployerDashboardServiceType>) => {
    const serviceDetails = [
        {
            title: "Bought Services",
            value: props.serviceDetails.boughtServices,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/10103/10103996.png"
        },
        {
            title: "InProgress Services",
            value: props.serviceDetails.inProgressServices,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/7154/7154465.png"
        },
        {
            title: "Completed Services",
            value: props.serviceDetails.completedServices,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/10610/10610477.png"
        }
    ];

    return (
        <article className="flex flex-col gap-2">
            <h2 className="text-xl text-slate-800 font-semibold">Services</h2>
            <ul className="flex flex-col flex-wrap gap-4">
                {serviceDetails.map((service, index) => <DashboardCard cardTitle={service.title} value={service.value} iconUrl={service.iconUrl} key={index} />)}
            </ul>
        </article>
    )
}

export default EmployerDashboardService