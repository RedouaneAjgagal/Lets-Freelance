import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

type CreatePaymentMethodResponse = {
    client_secret: string;
    hasUnpaidInvoices: boolean;
}

const createPaymentMethod = async () => {
    const response: AxiosResponse<Promise<CreatePaymentMethodResponse>> = await postRequest("advertisements/payment-methods/intent", {});

    const data = await response.data;
    return data;
}

export default createPaymentMethod;