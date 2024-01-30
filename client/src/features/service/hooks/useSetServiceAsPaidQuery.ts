import setServiceAsPaid, { SetServiceAsPaidPayload } from '../services/setServiceAsPaid'
import { useQuery } from '@tanstack/react-query'

const useSetServiceAsPaidQuery = ({ serviceId, session_id }: SetServiceAsPaidPayload) => {
    const setServiceAsPaidQuery = useQuery({
        queryKey: ["setServiceAsPaid", serviceId, session_id],
        queryFn: () => setServiceAsPaid({
            serviceId,
            session_id
        }),
        retry: false,
        refetchOnWindowFocus: false
    });

    return setServiceAsPaidQuery;
}

export default useSetServiceAsPaidQuery