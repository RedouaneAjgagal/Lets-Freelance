import Loading from "../../components/Loading";
import { useGetRefundRequestsQuery } from "../../features/contract"


const RefundRequests = () => {

    const getRefundRequestsQuery = useGetRefundRequestsQuery();

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Refund Requests</h1>
            {getRefundRequestsQuery.isLoading ?
                <Loading />
                : <div>
                    {getRefundRequestsQuery.data!.length}
                </div>
            }
        </main>
    )
}

export default RefundRequests