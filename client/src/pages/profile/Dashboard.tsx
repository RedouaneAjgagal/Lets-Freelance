import EmployerDashboard from "../../features/profile/components/EmployerDashboard";
import FreelancerDashboard from "../../features/profile/components/FreelancerDashboard";
import { useAppSelector } from "../../hooks/redux";

const Dashboard = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    return (
        <div className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Dashboard</h1>
            {
                userInfo!.userAs === "employer" ?
                    <EmployerDashboard />
                    :
                    <FreelancerDashboard />
            }
        </div>

    )
}

export default Dashboard