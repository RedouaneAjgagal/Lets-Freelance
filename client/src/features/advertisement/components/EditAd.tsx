import { useEffect } from "react";
import { useAppSelector } from "../../../hooks/redux";
import Overlay from "../../../layouts/Overlay"
import { useFreelancerServicesQuery } from "../../service";
import AdSetInputContainer from "./AdSetInputContainer";
import AdverisementPrimaryButton from "./AdverisementPrimaryButton";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { campaignFormAction, initialValidInput } from "../redux/campaignForm";
import { AdType } from "../services/getSingleCampaign";
import useUpdateAdMutation from "../hooks/useUpdateAdMutation";
import { UpdateAdPayload } from "../services/updateAd";
import { useParams } from "react-router-dom";

type EditAdProps = {
    onClose: () => void;
    ad: AdType;
    tableContainerRef: React.RefObject<HTMLDivElement>;
}

const EditAd = (props: React.PropsWithoutRef<EditAdProps>) => {
    const campaignForm = useAppSelector(state => state.campaignFormReducer);

    const freelancerServices = useFreelancerServicesQuery();

    const { campaignId } = useParams();

    const onSuccess = () => {
        props.onClose();
        props.tableContainerRef.current!.scrollTo({
            behavior: "smooth",
            left: 0
        });
    }

    const updateAdMutation = useUpdateAdMutation({
        onSuccess,
        campaignId: campaignId!,
        adId: props.ad.ad
    });

    const editAdHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (updateAdMutation.isLoading) return;

        const ad = campaignForm.ads[0];

        const adHasError = Object.values(ad).some(input => {
            if (typeof input === "string") return false;
            return input.error.isError
        });

        if (adHasError) return;

        updateAdMutation.mutate({
            adId: props.ad.ad,
            adDetails: {
                bidAmount: ad.bidAmount.value,
                category: ad.category.value as UpdateAdPayload["adDetails"]["category"],
                event: ad.event.value,
                service: ad.service.value._id,
                keywords: ad.keywords.value.map(keyword => keyword.content)
            }
        });

        console.log(adHasError);
    }

    const dispatch = useDispatch();

    useEffect(() => {
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
        }))
    }, []);

    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <div className="fixed w-[90%] bg-stone-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded shadow-lg flex flex-col gap-3">
                    <form onSubmit={editAdHandler} className="flex flex-col gap-4 max-h-[30rem] overflow-y-scroll relative" noValidate>
                        <div className="p-4">
                            <AdSetInputContainer adSet={campaignForm.ads[0]} adsLength={1} index={0} services={freelancerServices.data} isServicesLoading={freelancerServices.isLoading} type="update" />
                        </div>
                        <div className="flex gap-4 sticky left-0 bottom-0 bg-white w-full py-3 px-4 border-t border-slate-300 rounded-b">
                            <button className="font-medium text-slate-700" type="button" onClick={props.onClose}>Cancel</button>
                            <AdverisementPrimaryButton type="submit" isLoading={updateAdMutation.isLoading} fullWidth>
                                EDIT AD
                            </AdverisementPrimaryButton>
                        </div>
                    </form>
                </div>
            </>
            , document.getElementById("overlay")!)
    )
}

export default EditAd