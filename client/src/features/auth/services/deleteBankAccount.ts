import { AxiosResponse } from "axios";
import { deleteRequest } from "../../../services/api"

type DeleteBankAccountResponse = {
    msg: string;
}

const deleteBankAccount = async () => {
    const response: AxiosResponse<Promise<DeleteBankAccountResponse>> = await deleteRequest(`auth/bank-account`);

    const data = await response.data;
    return data;
}

export default deleteBankAccount;