import setServiceAsPaid, { SetServiceAsPaidPayload } from '../services/setServiceAsPaid'
import { useQuery } from '@tanstack/react-query'

const useSetServiceAsPaidQuery = (payload: SetServiceAsPaidPayload) => {
    const setServiceAsPaidQuery = useQuery({
        queryKey: ["setServiceAsPaid", payload.serviceId, payload.session_id],
        queryFn: () => setServiceAsPaid(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return setServiceAsPaidQuery;
}

export default useSetServiceAsPaidQuery