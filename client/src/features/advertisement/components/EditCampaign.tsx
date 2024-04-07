import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import Overlay from "../../../layouts/Overlay"
import { GetSingleCampaignResponse } from "../services/getSingleCampaign";
import CampaignForm from "./CampaignForm"
import { campaignFormAction, initialValidInput } from "../redux/campaignForm";
import useUpdateCampaignMutation from "../hooks/useUpdateCampaignMutation";
import { useParams } from "react-router-dom";

type EditCampaignProps = {
    onClose: () => void;
    campaignDetails: {
        name: GetSingleCampaignResponse["name"];
        budgetType: GetSingleCampaignResponse["budgetType"];
        budget: GetSingleCampaignResponse["budget"];
        endDate: GetSingleCampaignResponse["endDate"];
    }
}

const EditCampaign = (props: React.PropsWithoutRef<EditCampaignProps>) => {
    const dispatch = useAppDispatch();
    const campaignValues = useAppSelector(state => state.campaignFormReducer);

    const { campaignId } = useParams();

    const updateCampaignMutation = useUpdateCampaignMutation({
        onSuccess: props.onClose,
        campaignId: campaignId!
    });

    useEffect(() => {
        dispatch(campaignFormAction.setInitialData({
            ...campaignValues,
            name: {
                error: initialValidInput,
                value: props.campaignDetails.name
            },
            budgetType: {
                error: initialValidInput,
                value: props.campaignDetails.budgetType
            },
            budget: {
                error: initialValidInput,
                value: props.campaignDetails.budget
            },
            endDate: {
                error: initialValidInput,
                value: props.campaignDetails.endDate.split("T")[0]
            }
        }));
    }, []);

    return (
        <>
            <Overlay onClose={props.onClose} />
            <div className={`fixed w-[90%] bg-stone-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-3`}>
                <CampaignForm type="update" onCancel={props.onClose} submit={updateCampaignMutation} campaignId={campaignId!} />
            </div>
        </>
    )
}

export default EditCampaign