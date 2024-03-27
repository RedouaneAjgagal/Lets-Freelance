import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

export type PaymentMethodType = {
    id: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
    createdAt: string;
};

export type GetPaymentMethodsResponse = PaymentMethodType[];

const getPaymentMethods = async () => {
    const response: AxiosResponse<Promise<GetPaymentMethodsResponse>> = await getRequest("advertisements/payment-methods");

    const data = await response.data;
    return data;
}

export default getPaymentMethods;