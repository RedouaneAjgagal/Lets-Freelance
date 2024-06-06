import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

type RefundPaymentRequestPayload = {
    contractId: string;
    paymentId: string;
    status: "approved" | "rejected";
};

type RefundPaymentRequestResponse = {
    msg: string;
}

const refundPaymentRequest = async (payload: RefundPaymentRequestPayload) => {
    const response: AxiosResponse<Promise<RefundPaymentRequestResponse>> = await patchRequest(`contracts/${payload.contractId}/refund`, {
        reason: "requested_by_customer",
        paymentId: payload.paymentId,
        status: payload.status
    });

    const data = await response.data;
    return data;
};

export default refundPaymentRequest;