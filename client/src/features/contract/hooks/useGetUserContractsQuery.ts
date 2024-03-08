import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../hooks/redux'
import getUserContracts, { UserContractsQuery } from '../services/getUserContracts';

const useGetUserContractsQuery = (query: UserContractsQuery) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const getUserContractsQuery = useQuery({
        queryKey: ["userContracts", userInfo!.profileId],
        queryFn: () => getUserContracts(query),
        retry: false,
        refetchOnWindowFocus: false
    });

    return getUserContractsQuery
}

export default useGetUserContractsQuery