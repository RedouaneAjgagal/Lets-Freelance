import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

type CancelContractRequestPayload = {
    status: "canceled" | "inProgress";
    contractId: string;
};

type CancelContractRequestResponse = {
    msg: string;
}

const cancelContractRequest = async (payload: CancelContractRequestPayload) => {
    const response: AxiosResponse<Promise<CancelContractRequestResponse>> = await patchRequest(`contracts/cancel-requests`, payload);

    const data = await response.data;
    return data;
};

export default cancelContractRequest;