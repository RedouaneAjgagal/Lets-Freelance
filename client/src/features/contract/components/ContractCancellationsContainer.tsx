import TableHead from "../../../components/TableHead";
import { GetContractCancellationsResponse } from "../services/getContractCancellations"
import ContractCancellationItem from "./ContractCancellationItem";

type ContractCancellationsContainerProps = {
    contracts: GetContractCancellationsResponse;
}

const ContractCancellationsContainer = (props: React.PropsWithoutRef<ContractCancellationsContainerProps>) => {
    const tableHeads = ["Activity", "Subject", "Status", "Actions"];

    return (
        <section className='bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2'>
            {props.contracts.length ?
                <table className="text-left w-full">
                    <TableHead tableHeads={tableHeads} />
                    <tbody>
                        {
                            props.contracts.map(contract => <ContractCancellationItem key={contract._id} contract={contract} />)
                        }
                    </tbody>
                </table>
                : <>
                    <h2 className="text-xl font-medium">Empty..</h2>
                    <p className="text-slate-500">There is no contract cancellations requests</p>
                </>
            }
        </section>
    )
}

export default ContractCancellationsContainer