import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../hooks/redux'
import getEmployerBoughtServices from '../services/getEmployerBoughtServices';

const useEmployerBoughtServicesQuery = (status: "inprogress" | "completed" | "canceled" | "all") => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const employerBoughtServices = useQuery({
        queryKey: ["boughtServices", userInfo!.profileId],
        queryFn: () => getEmployerBoughtServices(status),
        retry: false,
        refetchOnWindowFocus: false
    });

    return employerBoughtServices;
}

export default useEmployerBoughtServicesQuery