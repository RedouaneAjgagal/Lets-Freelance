import { useEffect } from "react";
import { AdvertisementNavbar, CampaignForm, useCreateCampaignMutation } from "../../features/advertisement"
import { campaignFormAction } from "../../features/advertisement/redux/campaignForm";
import { useAppDispatch } from "../../hooks/redux";
import { useFreelancerServicesQuery } from "../../features/service";


const CreateCampaign = () => {
    const dispatch = useAppDispatch();

    const freelancerServices = useFreelancerServicesQuery();

    const createCampaignMutation = useCreateCampaignMutation();

    useEffect(() => {
        dispatch(campaignFormAction.resetState());
    }, []);

    return (
        <main className="flex flex-col">
            <div className="mt-6">
                <AdvertisementNavbar />
            </div>
            <h1 className="text-3xl font-semibold p-4">Create Campaign</h1>
            <div className="p-4">
                <CampaignForm type="create" freelancerServices={freelancerServices} submit={createCampaignMutation} />
            </div>
        </main>
    )
}

export default CreateCampaign