import { useParams, useSearchParams } from "react-router-dom"
import { SetServiceAsPaidContainer, useSetServiceAsPaidQuery } from "../../features/service";
import Loading from "../../components/Loading";
import { SetServiceAsPaidPayload } from "../../features/service/services/setServiceAsPaid";
import { useEffect } from "react";
import { useTrackAdOrderMutation } from "../../features/advertisement";


const SetAsPaidService = () => {
    const trackAdOrderMutation = useTrackAdOrderMutation();
    const { serviceId } = useParams();

    const [URLSearchParams] = useSearchParams();

    const sessionId = URLSearchParams.get("session_id");
    const trackId = URLSearchParams.get("track_id");

    if (!sessionId) {
        return (
            <main className="p-4 lg:flex lg:items-center lg:justify-center lg:min-h-[50vh]">
                <SetServiceAsPaidContainer isError msg="Something went wrong!" />
            </main>
        )
    }

    const setServiceAsPaidPayload: SetServiceAsPaidPayload = {
        serviceId: serviceId!,
        session_id: sessionId
    }

    if (trackId) {
        setServiceAsPaidPayload.track_id = trackId;
    }

    const setServiceAsPaidQuery = useSetServiceAsPaidQuery(setServiceAsPaidPayload);

    useEffect(() => {
        if (!setServiceAsPaidQuery.isSuccess || !setServiceAsPaidQuery.data.ad) return;
        trackAdOrderMutation.mutate(setServiceAsPaidQuery.data.ad);
    }, [setServiceAsPaidQuery.isSuccess]);

    return (
        <main className="p-4 lg:flex lg:items-center lg:justify-center lg:min-h-[50vh]">
            {
                setServiceAsPaidQuery.isLoading ?
                    <Loading withoutBackground />
                    :
                    <SetServiceAsPaidContainer isError={setServiceAsPaidQuery.isError} msg={setServiceAsPaidQuery.data?.msg || "Something went wrong"} />
            }
        </main>
    )
}

export default SetAsPaidService