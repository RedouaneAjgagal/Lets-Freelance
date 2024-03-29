import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

export type SetDefaultPaymentPayload = {
    paymentMethodId: string;
}

type SetDefaultPaymentAndTryUnpaidInvoicesResponse = {
    msg: string;
}

const setDefaultPaymentAndTryUnpaidInvoices = async (payload: SetDefaultPaymentPayload) => {
    const response: AxiosResponse<Promise<SetDefaultPaymentAndTryUnpaidInvoicesResponse>> = await postRequest("advertisements/payment-methods", {
        paymentMethodId: payload.paymentMethodId
    });

    const data = await response.data;
    return data;
}

export default setDefaultPaymentAndTryUnpaidInvoices;