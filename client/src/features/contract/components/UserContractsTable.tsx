import TableHead from "../../../components/TableHead";
import { ContractResponseType } from "../services/getUserContracts";
import UserContractTable from "./UserContractTable";

type UserContractsTableProps = {
    contracts: ContractResponseType[];
}

const UserContractsTable = (props: React.PropsWithoutRef<UserContractsTableProps>) => {

    const tableHeads = ["Activity Title", "Price", "Status", "Created At", "Actions"];

    return (
        <section className="bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2">
            <table className="text-left w-full">
                <TableHead width="wider" tableHeads={tableHeads} />
                <tbody>
                    {props.contracts.map(contract => <UserContractTable key={contract._id} contract={contract} />)}
                </tbody>
            </table>
        </section>
    )
}

export default UserContractsTable