import { postRequest } from "../../../services/api";

export type RefundContractPaymentPayload = {
    contractId: string;
    paymentId: string;
    subject: string;
    reason: string;
}

export type RefundContractPaymentResponse = {
    msg: string;
}

const refundContractPayment = async (payload: RefundContractPaymentPayload) => {
    const response = await postRequest(`contracts/${payload.contractId}/refund`, {
        paymentId: payload.paymentId,
        subject: payload.subject,
        reason: payload.reason
    });

    const data = await response.data as RefundContractPaymentResponse;
    return data;
}

export default refundContractPayment;