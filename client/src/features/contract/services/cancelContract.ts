import { postRequest } from "../../../services/api";

type CancelContractPayload = {
    contractId: string;
    subject: string;
    reason: string;
}

type CancelContractResponse = {
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