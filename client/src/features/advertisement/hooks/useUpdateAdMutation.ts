import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import updateAd from '../services/updateAd';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';
import { GetSingleCampaignResponse } from '../services/getSingleCampaign';

type UseUpdateAdMutationPayload = {
    onSuccess?: () => void;
    campaignId: string;
    adId: string;
}

const useUpdateAdMutation = (payload: UseUpdateAdMutationPayload) => {
    const queryClient = useQueryClient();
    const { userInfo } = useAppSelector(state => state.authReducer);

    const updateAdMutation = useMutation({
        mutationFn: updateAd,
        retry: false,
        onSuccess: (data) => {
            toast.success(`AD ID ${payload.adId} has been updated`, {
                id: "success_updateAdSet",
                duration: 3000
            });

            // set updated data
            queryClient.setQueryData<GetSingleCampaignResponse>(
                ["singleCampaign", payload.campaignId, userInfo!.profileId],
                (updater) => {
                    const ad = updater?.ads.find(adSet => adSet.ad === payload.adId);
                    if (ad) {
                        const keys = ["service", "bidAmount", "event", "category", "keywords"] as const;
                        keys.forEach(key => {
                            if (data[key]) {
                                ad[key] = data[key];
                            }
                        });
                    }

                    return updater;
                }
            )

            if (payload.onSuccess) {
                payload.onSuccess();
            }
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_updateAdSet",
                duration: 5000
            });
        }
    });

    return updateAdMutation;
}

export default useUpdateAdMutation