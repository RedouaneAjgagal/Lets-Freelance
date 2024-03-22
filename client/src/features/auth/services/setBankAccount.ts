import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

export type ExternalAccountFormData = {
    accountNumber: string;
    routingNumber?: string;
    accountHolderName: string;
    accountHolderType: "individual" | "company";
    accountCountry: string;
    currency: string;
}

export type SetBankAccountPayload = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dob: {
        day: number;
        month: number;
        year: number;
    };
    address: {
        country: string;
        city: string;
        state?: string;
        postal_code: string;
        line1: string;
        line2?: string;
    };
} & ExternalAccountFormData;

export type SetBankAccountResponse = {
    msg: string;
    addExtraInfoUrl?: string;
}

const setBankAccount = async (payload: SetBankAccountPayload) => {
    const response: AxiosResponse<Promise<SetBankAccountResponse>> = await postRequest(`auth/bank-account`, payload);

    const data = await response.data;
    return data;
}

export default setBankAccount