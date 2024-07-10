import { useEffect } from "react";
import Loading from "../../components/Loading";
import { EmployerBoughtServicesContainer, useEmployerBoughtServicesQuery } from "../../features/service"
import { useAppSelector } from "../../hooks/redux";

const EmployerBoughtServices = () => {
    const { filterBy } = useAppSelector(state => state.filterByStatusReducer);

    const boughtServicesQuery = useEmployerBoughtServicesQuery(filterBy);

    useEffect(() => {
        boughtServicesQuery.refetch();
    }, [filterBy]);


    return (
        <main className="p-4 flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Bought Services</h1>
            {
                boughtServicesQuery.isLoading
                    ? <Loading type="table" />
                    :
                    <EmployerBoughtServicesContainer boughtServices={boughtServicesQuery.data!} filterBy={filterBy} />
            }
        </main>
    )
}

export default EmployerBoughtServices