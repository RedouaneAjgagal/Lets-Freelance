import { useAppSelector } from "../../../hooks/redux";
import { useFreelancerServicesQuery } from "../../service";
import { AdType } from "../services/getSingleCampaign";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { campaignFormAction, initialValidInput } from "../redux/campaignForm";
import { UpdateAdPayload } from "../services/updateAd";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createPortal } from "react-dom";
import Overlay from "../../../layouts/Overlay";
import AdSetInputContainer from "./AdSetInputContainer";
import AdverisementPrimaryButton from "./AdverisementPrimaryButton";
import { CreateAdPayload, CreateAdResponse } from "../services/createAd";


type UpdateSingleAdType = {
    type: "update";
    ad: AdType;
    submitAd: UseMutationResult<Partial<UpdateAdPayload["adDetails"]>, AxiosError<{
        msg: string;
    }>, UpdateAdPayload, unknown>;
}

type CreateSingleAdType = {
    type: "create";
    submitAd: UseMutationResult<CreateAdResponse, AxiosError<{
        msg: string;
    }>, CreateAdPayload, unknown>;
    campaignId: string;
}

type SingleAdProps = {
    onClose: () => void;
    tableContainerRef: React.RefObject<HTMLDivElement>;
} & (UpdateSingleAdType | CreateSingleAdType);


const SingleAd = (props: React.PropsWithoutRef<SingleAdProps>) => {
    const campaignForm = useAppSelector(state => state.campaignFormReducer);
    const dispatch = useDispatch();

    const freelancerServices = useFreelancerServicesQuery();


    const submitAdHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (props.submitAd.isLoading) return;

        dispatch(campaignFormAction.submit());

        const ad = campaignForm.ads[0];

        const adHasError = Object.values(ad).some(input => {
            if (typeof input === "string") return false;
            return input.error.isError
        });

        if (adHasError) return;

        const adDetails = {
            bidAmount: ad.bidAmount.value,
            category: ad.category.value as UpdateAdPayload["adDetails"]["category"],
            event: ad.event.value,
            service: ad.service.value._id,
            keywords: ad.keywords.value.map(keyword => keyword.content)
        };

        if (props.type === "update") {
            props.submitAd.mutate({
                adId: props.ad.ad,
                adDetails
            });
        } else {
            props.submitAd.mutate({
                campaignId: props.campaignId,
                adDetails
            });
        }
    }


    useEffect(() => {
        if (props.type === "create") {
            dispatch(campaignFormAction.resetState());
            return;
        }

        dispatch(campaignFormAction.setInitialData({
            ...campaignForm,
            ads: [
                {
                    category: {
                        error: initialValidInput,
                        value: props.ad.category
                    },
                    ad: props.ad.ad,
                    bidAmount: {
                        error: initialValidInput,
                        value: props.ad.bidAmount
                    },
                    event: {
                        error: initialValidInput,
                        value: props.ad.event
                    },
                    keywords: {
                        error: initialValidInput,
                        value: props.ad.keywords.map(keyword => {
                            const _id = crypto.randomUUID();
                            return { _id, content: keyword }
                        })
                    },
                    service: {
                        error: initialValidInput,
                        value: {
                            _id: props.ad.service,
                            title: ""
                        }
                    }
                }
            ]
        }));
    }, []);

    useEffect(() => {
        if (props.submitAd.isSuccess) {
            console.log(true);
            
            props.onClose();
            props.tableContainerRef.current!.scrollTo({
                behavior: "smooth",
                left: 0
            });
        }
    }, [props.submitAd.isSuccess]);

    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <div className="fixed w-[90%] bg-stone-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded shadow-lg flex flex-col gap-3">
                    <form onSubmit={submitAdHandler} className="flex flex-col gap-4 max-h-[30rem] overflow-y-scroll relative" noValidate>
                        <div className="p-4">
                            <AdSetInputContainer adSet={campaignForm.ads[0]} adsLength={1} index={0} services={freelancerServices.data} isServicesLoading={freelancerServices.isLoading} type={props.type} />
                        </div>
                        <div className="flex gap-4 sticky left-0 bottom-0 bg-white w-full py-3 px-4 border-t border-slate-300 rounded-b">
                            <button className="font-medium text-slate-700" type="button" onClick={props.onClose}>Cancel</button>
                            <AdverisementPrimaryButton type="submit" isLoading={props.submitAd.isLoading} fullWidth>
                                {props.type === "update" ?
                                    "EDIT AD"
                                    : "NEW AD"
                                }
                            </AdverisementPrimaryButton>
                        </div>
                    </form>
                </div>
            </>
            , document.getElementById("overlay")!)
    )
}

export default SingleAd