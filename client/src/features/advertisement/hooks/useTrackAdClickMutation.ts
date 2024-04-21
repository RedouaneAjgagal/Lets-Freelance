import { useMutation } from '@tanstack/react-query';
import trackAdClick from '../services/trackAdClick';
import { useAppDispatch } from '../../../hooks/redux';
import { serviceAdClickTrackerAction } from '../redux/serviceAdClickTracker';
import { serviceAdOrderTrackerAction } from '../redux/serviceAdOrderTracker';

const useTrackAdClickMutation = () => {
    const dispatch = useAppDispatch();


    const trackAdClickMutation = useMutation({
        mutationFn: trackAdClick,
        retry: false,
        onSuccess: (data) => {
            dispatch(serviceAdClickTrackerAction.removeTracker({
                ad_id: data.ad_id
            }));

            dispatch(serviceAdOrderTrackerAction.addNewOrderTracker(data));
        }
    })

    return trackAdClickMutation;
}

export default useTrackAdClickMutation