import { TbLoader2 } from "react-icons/tb";
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
                <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <h1 className="text-xl">Verifying purchased connects..</h1>
                        <TbLoader2 className="animate-spin" size={20} />
                    </div>
                </div>
                :
                <div className="md:min-h-[35vh] lg:min-h-0">
                    <SetAsPaidConnectsContainer isError={setConnectsAsPaidQuery.isError} msg={setConnectsAsPaidQuery.data?.msg || "Something went wrong!"} />
                </div>
            }
        </main>
    )
}

export default SetAsPaidConnects