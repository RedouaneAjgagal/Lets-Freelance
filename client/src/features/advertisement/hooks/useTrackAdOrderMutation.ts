import { useMutation } from '@tanstack/react-query';
import React from 'react'
import trackAdOrder from '../services/trackAdOrder';

const useTrackAdOrderMutation = () => {
    const trackAdOrderMutation = useMutation({
        mutationFn: trackAdOrder,
        retry: false
    });

    return trackAdOrderMutation;
}

export default useTrackAdOrderMutation