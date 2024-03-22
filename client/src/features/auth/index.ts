import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import useVerifyEmailQuery from "./hooks/useVerifyEmailQuery";
import authReducer from "./redux/auth";
import useLogoutMutation from "./hooks/useLogoutMutation";
import { User } from "./services/getCurrentUser";
import useCurrentUserQuery from "./hooks/useCurrentUserQuery";
import useUserBankAccountsQuery from "./hooks/useUserBankAccountsQuery";
import useRemoveExternalBankAccountMutation from "./hooks/useRemoveExternalBankAccountMutation";
import useDeleteBankAccountMutation from "./hooks/useDeleteBankAccountMutation";
import useSetBankAccountMutation from "./hooks/useSetBankAccountMutation";
import { UserBankAccount, UserBankAccountsResponse } from "./services/getUserBankAccounts";
import { SetBankAccountPayload, SetBankAccountResponse, ExternalAccountFormData } from "./services/setBankAccount";

export {
    RegisterForm,
    LoginForm,
    useVerifyEmailQuery,
    authReducer,
    useLogoutMutation,
    useCurrentUserQuery,
    useUserBankAccountsQuery,
    useRemoveExternalBankAccountMutation,
    useDeleteBankAccountMutation,
    useSetBankAccountMutation
};

export type {
    User,
    UserBankAccount,
    UserBankAccountsResponse,
    SetBankAccountPayload,
    SetBankAccountResponse,
    ExternalAccountFormData
};
