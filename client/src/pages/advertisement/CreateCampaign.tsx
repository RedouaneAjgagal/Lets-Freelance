import { useEffect } from "react";
import { AdvertisementNavbar, CampaignForm } from "../../features/advertisement"
import { campaignFormAction } from "../../features/advertisement/redux/campaignForm";
import { useAppDispatch } from "../../hooks/redux";


const CreateCampaign = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(campaignFormAction.resetState());
    }, []);

    return (
        <main className="bg-slate-200/70 flex flex-col">
            <div className="mt-6">
                <AdvertisementNavbar />
            </div>
            <h1 className="text-3xl font-semibold p-4">Create Campaign</h1>
            <div className="p-4">
                <CampaignForm type="create" />
            </div>
        </main>
    )
}

export default CreateCampaign