import Loading from "../../../components/Loading";
import Review from "../../../components/Review";
import { useProfileReviewsQuery } from "../../reviews"

type AllProjectsReviewsProps = {
    profileId: string;
}

const AllProjectsReviews = (props: React.PropsWithoutRef<AllProjectsReviewsProps>) => {
    const profileReviewsQuery = useProfileReviewsQuery({
        profileId: props.profileId,
        inprogress_reviews_type: "job"
    });

    return (
        profileReviewsQuery.isLoading ?
            <Loading />
            :
            profileReviewsQuery.data!.completedReviews.length ?
                <ul className="flex flex-col gap-5">
                    {profileReviewsQuery.data!.completedReviews.map(review => <Review key={review._id} profile={review.submittedByProfile} rating={review.rating} description={review.description} createdAt={review.contract.createdAt} />)}
                </ul>
                :
                <p className="text-slate-600">Empty..</p>
    )
}

export default AllProjectsReviews