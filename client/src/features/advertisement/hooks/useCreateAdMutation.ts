import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import createAd from '../services/createAd';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';

type CreateAdMutationPayload = {
    campaignId: string;
}

const useCreateAdMutation = (payload: CreateAdMutationPayload) => {
    const queryClient = useQueryClient();
    const { userInfo } = useAppSelector(state => state.authReducer);

    const createAdMutation = useMutation({
        mutationFn: createAd,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_createAdSet",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["singleCampaign", payload.campaignId, userInfo!.profileId] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_createAdSet",
                duration: 5000
            });
        }
    })

    return createAdMutation;
}

export default useCreateAdMutation