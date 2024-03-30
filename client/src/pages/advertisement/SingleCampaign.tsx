import { useParams } from "react-router-dom";
import { AdvertisementNavbar, useGetSingleCampaignQuery } from "../../features/advertisement"
import Loading from "../../components/Loading";


const SingleCampaign = () => {
    const { campaignId } = useParams();
    const getSingleCampaign = useGetSingleCampaignQuery({
        campaignId: campaignId!
    });

    return (
        <main className="bg-slate-200/70 flex flex-col">
            <div className="mt-6">
                <AdvertisementNavbar />
            </div>
            <h1 className="text-3xl font-semibold p-4 mt-2">Campaign Details</h1>
            <div className="p-4">
                {getSingleCampaign.isLoading ?
                    <Loading />
                    : <h2>{getSingleCampaign.data?.name}</h2>
                }
            </div>
        </main>
    )
}

export default SingleCampaign