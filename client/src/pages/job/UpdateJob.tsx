import Loading from "../../components/Loading";
import { UpdateJobContainer, useGetSingleJobQuery } from "../../features/job"
import { useAppSelector } from "../../hooks/redux";

const UpdateJob = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const getSingleJobQuery = useGetSingleJobQuery();

    // check if the job belongs to the current employer
    if (getSingleJobQuery.isSuccess && !getSingleJobQuery.isLoading) {
        if (getSingleJobQuery.data.profile._id !== userInfo?.profileId) {
            throw new Error("Unauthorized action");
        }
    }

    return (
        <main className="p-4 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Edit Job</h1>
            {getSingleJobQuery.isLoading ?
                <Loading />
                : <UpdateJobContainer jobData={getSingleJobQuery.data!} />
            }
        </main>
    )
}

export default UpdateJob