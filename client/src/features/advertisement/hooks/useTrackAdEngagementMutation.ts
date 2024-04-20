import { useMutation } from '@tanstack/react-query';
import trackAdEngagement from '../services/trackAdEngagement';

type TrackAdEngagementMutationPayload = {
    adId?: string;
}

const useTrackAdEngagementMutation = (payload: TrackAdEngagementMutationPayload) => {
    const mutationKey = ["trackAdEngagement"];

    if (payload.adId) {
        mutationKey.push(payload.adId);
    }

    const trackAdEngagementMutation = useMutation({
        mutationKey,
        mutationFn: trackAdEngagement,
        retry: false,
        onSuccess: (data) => {
            console.log(data);
        }
    })

    return trackAdEngagementMutation;
}

export default useTrackAdEngagementMutation