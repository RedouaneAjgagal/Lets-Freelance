import { useQuery } from '@tanstack/react-query';
import getRefundRequests from '../services/getRefundRequests';

const useGetRefundRequestsQuery = () => {
    const getRefundRequestsQuery = useQuery({
        queryKey: ["refundRequests"],
        queryFn: () => getRefundRequests(),
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });

    return getRefundRequestsQuery;
}

export default useGetRefundRequestsQuery