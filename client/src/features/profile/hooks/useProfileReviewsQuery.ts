import { useParams } from "react-router-dom";
import getProfileReviews from "../services/getProfileReviews"
import { useQuery } from "@tanstack/react-query"


const useProfileReviewsQuery = () => {
    const params = useParams();
    const { profileId } = params;


    const profileReviewsQuery = useQuery({
        queryKey: ["profileReviews", profileId],
        queryFn: () => getProfileReviews({ profileId: profileId! }),
        refetchOnWindowFocus: false,
        retry: false
    });

    return profileReviewsQuery;
}

export default useProfileReviewsQuery;