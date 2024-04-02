import { AdvertisementNavbar, CampaignForm } from "../../features/advertisement"


const CreateCampaign = () => {
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