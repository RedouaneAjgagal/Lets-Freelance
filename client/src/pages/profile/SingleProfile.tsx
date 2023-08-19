import Loading from "../../components/Loading";
import SingleProfileEmployer from "../../features/profile/components/SingleProfileEmployer";
import SingleProfileFreelancer from "../../features/profile/components/SingleProfileFreelancer"
import useSingleProfileQuery from "../../features/profile/hooks/useSingleProfileQuery";

const SingleProfile = () => {
    const singleProfileQuery = useSingleProfileQuery();

    return (
        <main className="grid gap-4">
            {singleProfileQuery.isLoading ? <Loading />
                :
                (singleProfileQuery.data?.userAs === "freelancer" ?
                    <SingleProfileFreelancer />
                    :
                    <SingleProfileEmployer />)
            }
        </main>
    )
}

export default SingleProfile