import { useParams } from "react-router-dom";
import { AdvertisementNavbar, SingleCampaignContainer, useGetSingleCampaignQuery } from "../../features/advertisement"
import Loading from "../../components/Loading";


const SingleCampaign = () => {
    const { campaignId } = useParams();
    const getSingleCampaign = useGetSingleCampaignQuery({
        campaignId: campaignId!
    });

    return (
        <main className="flex flex-col">
            <div className="mt-6">
                <AdvertisementNavbar />
            </div>
            <h1 className="text-3xl font-semibold p-4 mt-2">Campaign Details</h1>
            <div className="p-4">
                {getSingleCampaign.isLoading ?
                    <Loading type="table" />
                    : <SingleCampaignContainer campaign={getSingleCampaign.data!} />
                }
            </div>
        </main>
    )
}

export default SingleCampaign