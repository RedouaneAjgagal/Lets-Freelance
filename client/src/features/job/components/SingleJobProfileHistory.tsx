import Loading from "../../../components/Loading";
import { ProfileHistory } from "../../profile";
import { useProfileReviewsQuery } from "../../reviews"

type SingleJobProfileHistoryProps = {
    employerId: string;
}

const SingleJobProfileHistory = (props: React.PropsWithoutRef<SingleJobProfileHistoryProps>) => {
    const employerWorkHistory = useProfileReviewsQuery({
        profileId: props.employerId,
        inprogress_reviews_type: "job"
    });

    return (
        employerWorkHistory.isLoading ?
            <Loading withoutBackground />
            : <div>
                <ProfileHistory completedJobs={employerWorkHistory.data!.completedReviews} inProgressJobs={[]} />
            </div>
    )
}

export default SingleJobProfileHistory