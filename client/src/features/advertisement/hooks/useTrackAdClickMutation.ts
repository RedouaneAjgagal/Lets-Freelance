import { useMutation } from '@tanstack/react-query';
import trackAdClick from '../services/trackAdClick';
import { useAppDispatch } from '../../../hooks/redux';
import { serviceAdClickTrackerAction } from '../redux/serviceAdClickTracker';

const useTrackAdClickMutation = () => {
    const dispatch = useAppDispatch();


    const trackAdClickMutation = useMutation({
        mutationFn: trackAdClick,
        retry: false,
        onSuccess: (data) => {
            dispatch(serviceAdClickTrackerAction.removeTracker({
                ad_id: data.ad_id
            }));
            console.log({ isClick: true, data });
        }
    })

    return trackAdClickMutation;
}

export default useTrackAdClickMutation