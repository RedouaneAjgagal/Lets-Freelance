import Loading from "../../components/Loading";
import SingleProfileEmployer from "../../features/profile/components/SingleProfileEmployer";
import SingleProfileFreelancer from "../../features/profile/components/SingleProfileFreelancer"
import useSingleProfileQuery from "../../features/profile/hooks/useSingleProfileQuery";
import { useParams } from "react-router-dom";

const SingleProfile = () => {
    const { profileId } = useParams();
    const singleProfileQuery = useSingleProfileQuery({
        profileId: profileId!
    });

    return (
        <main className="grid gap-4">
            {singleProfileQuery.isLoading ? <Loading />
                :
                (singleProfileQuery.data?.userAs === "freelancer" ?
                    <SingleProfileFreelancer freelancerDetails={singleProfileQuery.data!} profileId={profileId!} />
                    :
                    <SingleProfileEmployer employerDetails={singleProfileQuery.data!} profileId={profileId!} />)
            }
        </main>
    )
}

export default SingleProfile