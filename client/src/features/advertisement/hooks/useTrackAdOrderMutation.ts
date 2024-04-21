import { useMutation } from '@tanstack/react-query';
import trackAdOrder from '../services/trackAdOrder';

const useTrackAdOrderMutation = () => {
    const trackAdOrderMutation = useMutation({
        mutationFn: trackAdOrder,
        retry: false
    });

    return trackAdOrderMutation;
}

export default useTrackAdOrderMutation