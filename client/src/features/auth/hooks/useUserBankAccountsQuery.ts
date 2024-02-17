import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../hooks/redux'
import getUserBankAccounts from '../services/getUserBankAccounts';

type UseUserBankAccountsQueryPayload = {
    fetchBankAccounts: boolean;
}

const useUserBankAccountsQuery = (payload: UseUserBankAccountsQueryPayload) => {
    if (!payload.fetchBankAccounts) {
        return;
    }

    const { userInfo } = useAppSelector(state => state.authReducer);

    const userBankAccouontsQuery = useQuery({
        queryKey: ["bankAccounts", userInfo!.profileId],
        queryFn: getUserBankAccounts,
        refetchOnWindowFocus: false,
        retry: 0
    })

    return userBankAccouontsQuery
}

export default useUserBankAccountsQuery