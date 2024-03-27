import { AxiosResponse } from "axios";
import { deleteRequest } from "../../../services/api"

export type DeletePaymentMethodPayload = {
    paymentMethodId: string;
}

export type DeletePaymentMethodResponse = {
    msg: string;
}

const deletePaymentMethod = async (payload: DeletePaymentMethodPayload) => {
    const response: AxiosResponse<Promise<DeletePaymentMethodResponse>> = await deleteRequest(`advertisements/payment-methods/${payload.paymentMethodId}`);

    const data = await response.data;
    return data;
}

export default deletePaymentMethod;