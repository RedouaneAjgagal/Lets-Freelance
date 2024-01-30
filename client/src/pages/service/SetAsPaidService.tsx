import { useParams, useSearchParams } from "react-router-dom"
import { SetServiceAsPaidContainer, useSetServiceAsPaidQuery } from "../../features/service";
import Loading from "../../components/Loading";


const SetAsPaidService = () => {

    const { serviceId } = useParams();

    const [URLSearchParams] = useSearchParams();

    const sessionId = URLSearchParams.get("session_id");

    if (!sessionId) {
        return <SetServiceAsPaidContainer isError msg="Something went wrong!" />
    }

    const setServiceAsPaidQuery = useSetServiceAsPaidQuery({
        serviceId: serviceId!,
        session_id: sessionId
    });

    console.log(setServiceAsPaidQuery.data);


    return (
        <main className="p-4">
            {
                setServiceAsPaidQuery.isLoading ?
                    <Loading />
                    :
                    <SetServiceAsPaidContainer isError={setServiceAsPaidQuery.isError} msg={setServiceAsPaidQuery.data?.msg || "Something went wrong"} />
            }
        </main>
    )
}

export default SetAsPaidService