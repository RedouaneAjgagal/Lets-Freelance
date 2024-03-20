import { AxiosResponse } from "axios";
import { deleteRequest } from "../../../services/api";

type DeleteExternalBankAccountPayload = {
    bankAccountId: string;
}

type DeleteExternalBankAccountResponse = {
    msg: string;
}

const deleteExternalBankAccount = async (payload: DeleteExternalBankAccountPayload) => {
    const response: AxiosResponse<Promise<DeleteExternalBankAccountResponse>> = await deleteRequest(`auth/bank-account/${payload.bankAccountId}`);

    const data = await response.data;
    return data;
}

export default deleteExternalBankAccount;