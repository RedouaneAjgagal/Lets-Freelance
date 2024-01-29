import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import getServiceReviews from '../services/getServiceReviews';

const useServiceReviewsQuery = () => {
    const { serviceId } = useParams();

    const serviceReviewsQuery = useQuery({
        queryKey: ["serviceReviews", serviceId],
        queryFn: () => getServiceReviews(serviceId!),
        retry: false,
        refetchOnWindowFocus: false
    });

    return serviceReviewsQuery;
}

export default useServiceReviewsQuery