import Loading from "../../components/Loading";
import { AdvertisementNavbar, CampaignsContainer, useGetCampaignsQuery } from "../../features/advertisement"
import AdverisementPrimaryLink from "../../features/advertisement/components/AdverisementPrimaryLink";

const Campaigns = () => {
    const getCampaignsQuery = useGetCampaignsQuery();

    return (
        <main className="bg-slate-200/70 flex flex-col">
            <div className="mt-6">
                <AdvertisementNavbar />
            </div>
            <h1 className="text-3xl font-semibold p-4 mt-2">My Campaigns</h1>
            <div className="p-4">
                {getCampaignsQuery.isLoading ?
                    <Loading />
                    : getCampaignsQuery.data?.length ?
                        <CampaignsContainer campaigns={getCampaignsQuery.data!} />
                        : <div className="flex flex-col gap-3">
                            <p className="text-slate-600">Empty.. You havn't created any campaings yet</p>
                            <AdverisementPrimaryLink to="/profile/freelancer/advertisements/create/campaign">CREATE NEW CAMPAIGN</AdverisementPrimaryLink>
                        </div>
                }
            </div>
        </main>
    )
}

export default Campaigns