import { EmployerReportsType } from "../services/getEmployerReports"
import DashboardCardContainer from "./DashboardCardContainer";

type EmployerDashboardTotalSpentProps = {
    totalSpentDetails: EmployerReportsType["totalSpent"];
}

const EmployerDashboardTotalSpent = (props: React.PropsWithoutRef<EmployerDashboardTotalSpentProps>) => {
    const totalSpentDetails = [
        {
            title: "Spent On Jobs",
            value: `$${props.totalSpentDetails.spentOnJobs.toFixed(2)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/1001/1001371.png"
        },
        {
            title: "Spent On Services",
            value: `$${props.totalSpentDetails.spentOnServices.toFixed(2)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/3247/3247170.png"
        },
        {
            title: "Refunded",
            value: `$${props.totalSpentDetails.refunded.toFixed(2)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/5868/5868585.png"
        }
    ];

    return (
        <DashboardCardContainer cardsDetails={totalSpentDetails} sectionTitle="Total Spent" />
    )
}

export default EmployerDashboardTotalSpent