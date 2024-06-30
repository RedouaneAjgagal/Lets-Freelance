import Loading from "../../components/Loading";
import { useProfileInfoQuery } from "../../features/profile"
import { ConnectsContainer } from "../../features/profile";

const Connects = () => {

    const profileInfo = useProfileInfoQuery();

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Connects</h1>
            {
                profileInfo.isLoading ?
                    <Loading type="table" />
                    :
                    <ConnectsContainer connects={profileInfo.data!.data.roles.freelancer!.connects} />
            }

        </main>
    )
}

export default Connects