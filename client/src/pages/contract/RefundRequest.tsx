import { useParams } from "react-router-dom"
import { RefundRequestForm, useContractQuery } from "../../features/contract";
import Loading from "../../components/Loading";


const RefundRequest = () => {
    const { contractId, paymentId } = useParams();

    const contractQuery = useContractQuery();

    if (!contractQuery.isLoading && contractQuery.isSuccess) {
        const payment = contractQuery.data.payments.find(payment => (payment._id === paymentId && payment.employer.status === "paid"));
        if (!payment) {
            throw new Error("Unauthorized action");
        }
    }

    return (
        <main className="p-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Refund request</h1>
            <div className="flex flex-col gap-1">
                <small>Contract ID: {contractId}</small>
                <small>Payment ID: {paymentId}</small>
            </div>
            {contractQuery.isLoading ?
                <Loading />
                : <RefundRequestForm paymentId={paymentId!} />
            }
        </main>
    )
}

export default RefundRequest