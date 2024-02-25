import getProfileReviews from "../services/getProfileReviews"
import { useQuery } from "@tanstack/react-query"

type ProfileReviewsQueryTypes = {
    profileId: string;
    completed_reviews_type?: "service" | "job";
    inprogress_reviews_type?: "service" | "job";
}

const useProfileReviewsQuery = ({ profileId, completed_reviews_type, inprogress_reviews_type }: ProfileReviewsQueryTypes) => {

    const profileReviewsQuery = useQuery({
        queryKey: ["profileReviews", profileId],
        queryFn: () => getProfileReviews({
            profileId: profileId!,
            completed_reviews_type,
            inprogress_reviews_type
        }),
        refetchOnWindowFocus: false,
        retry: false
    });

    return profileReviewsQuery;
}

export default useProfileReviewsQuery;