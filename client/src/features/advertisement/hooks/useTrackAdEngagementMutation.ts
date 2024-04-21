import { useMutation } from '@tanstack/react-query';
import trackAdEngagement from '../services/trackAdEngagement';
import { useAppDispatch } from '../../../hooks/redux';
import { serviceAdClickTrackerAction } from '../redux/serviceAdClickTracker';

type TrackAdEngagementMutationPayload = {
    adId?: string;
}

const useTrackAdEngagementMutation = (payload: TrackAdEngagementMutationPayload) => {
    const dispatch = useAppDispatch();

    const mutationKey = ["trackAdEngagement"];
    if (payload.adId) {
        mutationKey.push(payload.adId);
    }

    const trackAdEngagementMutation = useMutation({
        mutationKey,
        mutationFn: trackAdEngagement,
        retry: false,
        onSuccess: (data) => {
            dispatch(serviceAdClickTrackerAction.addNewTracker(data));
        }
    })

    return trackAdEngagementMutation;
}

export default useTrackAdEngagementMutation