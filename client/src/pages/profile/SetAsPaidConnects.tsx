import Loading from "../../components/Loading";
import { SetAsPaidConnectsContainer, useSetConnectsAsPaidQuery } from "../../features/profile"
import { useSearchParams } from "react-router-dom"

const SetAsPaidConnects = () => {

    const [URLSearchParams] = useSearchParams();
    const sessionId = URLSearchParams.get("session_id");
    if (!sessionId) {
        return (
            <main className="p-4">
                <SetAsPaidConnectsContainer isError msg="Something went wrong!" />
            </main>
        )
    }

    const setConnectsAsPaidQuery = useSetConnectsAsPaidQuery({
        sessionId
    });

    return (
        <main className="p-4">
            {setConnectsAsPaidQuery.isLoading ?
                <Loading />
                :
                <SetAsPaidConnectsContainer isError={setConnectsAsPaidQuery.isError} msg={setConnectsAsPaidQuery.data?.msg || "Something went wrong!"} />
            }
        </main>
    )
}

export default SetAsPaidConnects