import { AnalyticsContainer } from "../../features/analytics";
import EmployerDashboard from "../../features/profile/components/EmployerDashboard";
import FreelancerDashboard from "../../features/profile/components/FreelancerDashboard";
import { useAppSelector } from "../../hooks/redux";

const Dashboard = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Dashboard</h1>
            {userInfo!.role === "user"
                ? userInfo!.userAs === "employer"
                    ? <EmployerDashboard />
                    :
                    <FreelancerDashboard />
                : <AnalyticsContainer role={userInfo!.role} />
            }
        </main>

    )
}

export default Dashboard