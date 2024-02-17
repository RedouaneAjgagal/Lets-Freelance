import { getRequest } from "../../../services/api"

type UserBankAccount = {
    _id: string;
    accountLastFour: string;
    country: string;
    currency: string;
    isDefault: boolean;
}

type UserBankAccountsResponse = UserBankAccount[];

const getUserBankAccounts = async () => {
    const response = await getRequest("auth/bank-account");
    const data = await response.data as UserBankAccountsResponse;
    return data;
};

export default getUserBankAccounts;