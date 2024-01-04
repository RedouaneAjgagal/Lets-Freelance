import { FreelnacerReportsType } from "../services/getFreelancerReports"
import DashboardCardContainer from "./DashboardCardContainer";

type FreelancerDashboardServiceProps = {
    serviceDetails: FreelnacerReportsType["service"];
}

const FreelancerDashboardService = (props: React.PropsWithoutRef<FreelancerDashboardServiceProps>) => {

    const serviceDetails = [
        {
            title: "Posted Services",
            value: props.serviceDetails.postedServices,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/2311/2311991.png"
        },
        {
            title: "In Queue Services",
            value: props.serviceDetails.inQueueServices,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/7154/7154465.png"
        },
        {
            title: "Completed Services",
            value: props.serviceDetails.completedServices,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/10610/10610477.png"
        },
        {
            title: "Services Revenue",
            value: `$${props.serviceDetails.servicesRevenue.toFixed(2)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/1421/1421362.png"
        }
    ]
    return (
        <DashboardCardContainer cardsDetails={serviceDetails} sectionTitle="Services" />
    )
}

export default FreelancerDashboardService