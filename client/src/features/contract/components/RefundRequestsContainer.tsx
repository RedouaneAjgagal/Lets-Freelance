import TableHead from "../../../components/TableHead";
import { GetRefundRequestContractsResponse } from "../services/getRefundRequests"
import RefundRequestItem from "./RefundRequestItem";

type RefundRequestsContainerProps = {
    refundRequestContracts: GetRefundRequestContractsResponse;
}

const RefundRequestsContainer = (props: React.PropsWithoutRef<RefundRequestsContainerProps>) => {

    const tableHeads = ["Activity", "Amount", "Status", "Actions"];

    return (
        <section className='bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2'>
            {props.refundRequestContracts.length ?
                <table className="text-left w-full">
                    <TableHead tableHeads={tableHeads} />
                    <tbody>
                        {props.refundRequestContracts.map(refundRequestContract => <RefundRequestItem key={refundRequestContract._id} refundRequestContract={refundRequestContract} />)}
                    </tbody>
                </table>
                : <>
                    <h2 className="text-xl font-medium">Empty..</h2>
                    <p className="text-slate-500">There is no refund requests</p>
                </>
            }
        </section>
    )
}

export default RefundRequestsContainer