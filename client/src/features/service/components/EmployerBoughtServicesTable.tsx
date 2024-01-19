import TableHead from "../../../components/TableHead";
import { BoughtServiceType } from "../services/getEmployerBoughtServices"
import EmployerBoughtServiceTable from "./EmployerBoughtServiceTable";

type EmployerBoughtServicesTableProps = {
    boughtServices: BoughtServiceType[];
}

const EmployerBoughtServicesTable = (props: React.PropsWithoutRef<EmployerBoughtServicesTableProps>) => {

    const tableHeads = ["Title", "Order Price", "Status", "Bought At", "Actions"];

    return (
        <table className="text-left w-full">
            <TableHead tableHeads={tableHeads} width="wide" />
            <tbody>
                {props.boughtServices.map(boughtService => <EmployerBoughtServiceTable key={boughtService._id} service={boughtService} />)}
            </tbody>
        </table>
    )
}

export default EmployerBoughtServicesTable