import Loading from "../../components/Loading";
import { FreelancerServicesTable, useFreelancerServicesQuery } from "../../features/service"

const FreelancerServices = () => {
    const freelancerServices = useFreelancerServicesQuery();
    return (
        <main className="p-4 flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">My Services</h1>
            {freelancerServices.isLoading ?
                <Loading type="table" />
                :
                <FreelancerServicesTable services={freelancerServices.data!} />
            }
        </main>
    )
}

export default FreelancerServices