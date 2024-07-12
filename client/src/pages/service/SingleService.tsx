import { useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useSingleServiceQuery } from "../../features/service";
import { SingleServiceContainer } from "../../features/service";
import { useAppSelector } from "../../hooks/redux";
import { useTrackAdClickMutation } from "../../features/advertisement";
import { useEffect } from "react";


const SingleService = () => {
    const singleServiceQuery = useSingleServiceQuery({ isForm: false })!;
    const serviceAdClickTrackers = useAppSelector(state => state.serviceAdClickTrackerReducer);

    const trackAdClickMutation = useTrackAdClickMutation();

    const [URLSearchParams] = useSearchParams();
    const adId = URLSearchParams.get("ad_id");

    let hasBeenMutate = false;
    useEffect(() => {
        if (!adId || hasBeenMutate) return;

        const adService = serviceAdClickTrackers.find(adService => adService.ad_id === adId);
        if (adService) {
            hasBeenMutate = true;
            trackAdClickMutation.mutate({
                ad: adService.ad_id,
                track: adService.track_id
            });
        }
    }, [serviceAdClickTrackers]);

    return (
        singleServiceQuery.isLoading
            ? <div className="p-4 xl:max-w-[95rem] xl:m-auto px-4">
                <Loading type="singlePage" withImage />
            </div>
            : <SingleServiceContainer serviceInfo={singleServiceQuery.data!} />
    )
}

export default SingleService