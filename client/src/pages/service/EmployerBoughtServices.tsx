import Loading from "../../components/Loading";
import { EmployerBoughtServicesContainer, useEmployerBoughtServicesQuery } from "../../features/service"

const EmployerBoughtServices = () => {

    const boughtServices = useEmployerBoughtServicesQuery("completed");

    return (
        <main className="p-4 flex flex-col gap-6 bg-purple-100/30">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">My Services</h1>
            {
                boughtServices.isLoading ?
                    <Loading />
                    :
                    <EmployerBoughtServicesContainer />
            }
        </main>
    )
}

export default EmployerBoughtServices