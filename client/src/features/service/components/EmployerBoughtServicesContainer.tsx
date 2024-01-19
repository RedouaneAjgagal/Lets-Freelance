import { BoughtServiceType } from "../services/getEmployerBoughtServices"
import EmployerBoughtServicesTable from "./EmployerBoughtServicesTable";
import FilterByStatus from "./FilterByStatus";

type BoughtServicesContainerProps = {
    boughtServices: BoughtServiceType[];
}

const EmployerBoughtServicesContainer = (props: React.PropsWithoutRef<BoughtServicesContainerProps>) => {
    return (
        <div className="flex flex-col gap-3">
            <FilterByStatus />
            <section className='bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2'>
                {props.boughtServices.length ?
                    <EmployerBoughtServicesTable boughtServices={props.boughtServices} />
                    :
                    <>
                        <h2 className="text-xl font-medium">Empty..</h2>
                        <p className="text-slate-500">You haven't bought any service yet.</p>
                    </>
                }
            </section>
        </div>
    )
}

export default EmployerBoughtServicesContainer