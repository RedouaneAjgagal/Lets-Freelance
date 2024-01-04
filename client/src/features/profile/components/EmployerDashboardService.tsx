import { EmployerReportsType } from "../services/getEmployerReports"
import DashboardCardContainer from "./DashboardCardContainer";

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
        <DashboardCardContainer cardsDetails={serviceDetails} sectionTitle="Services" />
    )
}

export default EmployerDashboardService