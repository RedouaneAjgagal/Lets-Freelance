import { AxiosResponse } from "axios";
import { ExternalAccountFormData } from "./setBankAccount";
import { patchRequest } from "../../../services/api";

export type AddExternalBankAccountPayload = ExternalAccountFormData;

export type AddExternalBankAccountResponse = {
    msg: string;
}

const addExternalBankAccount = async (payload: AddExternalBankAccountPayload) => {
    const response: AxiosResponse<Promise<AddExternalBankAccountResponse>> = await patchRequest(`auth/bank-account`, payload);

    const data = await response.data;
    return data;
}

export default addExternalBankAccount;