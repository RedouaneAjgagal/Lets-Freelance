import { FreelnacerReportsType } from "../services/getFreelancerReports";
import DashboardCardContainer from "./DashboardCardContainer";

type FreelancerDashboardConnectProps = {
    connectDetails: FreelnacerReportsType["connect"];
}

const FreelancerDashboardConnect = (props: React.PropsWithoutRef<FreelancerDashboardConnectProps>) => {

    const connectDetails = [
        {
            title: "Connects Spent On Proposals",
            value: props.connectDetails.connectsSpentOnProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/8138/8138511.png"
        },
        {
            title: "Connects Spend To Boost Proposals",
            value: props.connectDetails.connectsSpendToBoostProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/6009/6009451.png"
        },
        {
            title: "Total Spent On Connects",
            value: `$${props.connectDetails.totalSpentOnConnects.toFixed(2)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/1421/1421362.png"
        }
    ]

    return (
        <DashboardCardContainer cardsDetails={connectDetails} sectionTitle="Connects" />
    )
}

export default FreelancerDashboardConnect