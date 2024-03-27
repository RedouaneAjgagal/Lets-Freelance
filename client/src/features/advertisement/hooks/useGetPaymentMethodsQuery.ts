import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../../hooks/redux';
import getPaymentMethods from '../services/getPaymentMethods';

const useGetPaymentMethodsQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const getPaymentMethodsQuery = useQuery({
        queryKey: ["paymentMethods", userInfo!.profileId],
        queryFn: getPaymentMethods,
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });

    return getPaymentMethodsQuery;
}

export default useGetPaymentMethodsQuery