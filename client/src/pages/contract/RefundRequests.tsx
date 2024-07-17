import Loading from "../../components/Loading";
import { RefundRequestsContainer, useGetRefundRequestsQuery } from "../../features/contract"


const RefundRequests = () => {

    const getRefundRequestsQuery = useGetRefundRequestsQuery();

    return (
        <main className="p-4 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Refund Requests</h1>
            {getRefundRequestsQuery.isLoading ?
                <Loading type="table" />
                : <RefundRequestsContainer refundRequestContracts={getRefundRequestsQuery.data!} />
            }
        </main>
    )
}

export default RefundRequests