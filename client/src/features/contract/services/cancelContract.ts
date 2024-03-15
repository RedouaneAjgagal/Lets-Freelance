import { postRequest } from "../../../services/api";

export type CancelContractPayload = {
    contractId: string;
    subject: string;
    reason: string;
}

export type CancelContractResponse = {
    msg: string;
}

const cancelContract = async (payload: CancelContractPayload) => {
    const response = await postRequest(`contracts/${payload.contractId}`, {
        subject: payload.subject,
        reason: payload.reason
    });

    const data = await response.data as CancelContractResponse;
    return data;
};

export default cancelContract;