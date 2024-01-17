import { useQuery, useQueryClient } from '@tanstack/react-query'
import setAsPaidConnects from '../services/setAsPaidConnects'

const useSetConnectsAsPaidQuery = ({ sessionId }: { sessionId: string }) => {
    const queryClient = useQueryClient();

    const setConnectsAsPaidQuery = useQuery({
        queryKey: ["setConnectsAsPaid", sessionId],
        queryFn: () => setAsPaidConnects(sessionId),
        retry: false,
        refetchOnWindowFocus: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profileInfo"] });
        },
    });

    return setConnectsAsPaidQuery;
}

export default useSetConnectsAsPaidQuery