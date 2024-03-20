import { getRequest } from "../../../services/api"

export type UserBankAccount = {
    _id: string;
    accountLastFour: string;
    country: string;
    currency: string;
    isDefault: boolean;
}

export type UserBankAccountsResponse = {
    bankAccounts: UserBankAccount[];
    defaultCurrency: string;
};

const getUserBankAccounts = async () => {
    const response = await getRequest("auth/bank-account");
    const data = await response.data as UserBankAccountsResponse;
    return data;
};

export default getUserBankAccounts;