import { patchRequest } from "../../../services/api";

type CompleteContractPayload = {
    activityType: "service" | "job";
    contractId: string;
};

type CompletedContractResponse = {
    msg: string;
};

const completeContract = async (payload: CompleteContractPayload) => {
    const response = await patchRequest(`contracts/${payload.contractId}/${payload.activityType}`, {
        isCompleted: true
    });

    const data = await response.data as CompletedContractResponse;
    return data;
};

export default completeContract;