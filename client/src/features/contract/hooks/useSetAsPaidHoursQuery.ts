import { useQuery } from '@tanstack/react-query';
import setAsPaidHours, { SetAsPaidHoursPayload } from '../services/setAsPaidHours';

const useSetAsPaidHoursQuery = (payload: SetAsPaidHoursPayload) => {
    const setAsPaidHoursQuery = useQuery({
        queryKey: ["setPaidHourlyContract", payload.contractId, payload.session_id],
        queryFn: () => setAsPaidHours(payload),
        retry: false,
        refetchOnWindowFocus: false
    })

    return setAsPaidHoursQuery;
}

export default useSetAsPaidHoursQuery