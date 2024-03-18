import { getRequest } from "../../../services/api";

type GetProfileReviewsQueries = {
    completed_reviews_type?: "job" | "service";
    inprogress_reviews_type?: "job" | "service";
};

type GetProfileReviews = {
    profileId: string;
} & GetProfileReviewsQueries;


export type InProgressReviewsType = {
    [key in "job" | "service"]: {
        title: string;
    };
} & {
    createdAt: string;
    _id: string;
};

export type CompletedReviewsType = {
    _id: string;
    contract: {
        createdAt: string;
        completedAt: string;
    };
    activityTitle: string;
    description?: string;
    rating: number;
    submittedByProfile: {
        _id: string;
        name: string;
        avatar: string;
    };
};

export type ProfileReviewsType = {
    completedReviews: CompletedReviewsType[];
    inProgressReviews: InProgressReviewsType[];
}


const getProfileReviews = async ({ profileId, completed_reviews_type, inprogress_reviews_type }: GetProfileReviews) => {

    const requestQueries: GetProfileReviewsQueries = {};

    if (completed_reviews_type) {
        requestQueries.completed_reviews_type = completed_reviews_type;
    }
    if (inprogress_reviews_type) {
        requestQueries.inprogress_reviews_type = inprogress_reviews_type;
    }

    const queries = Object.entries(requestQueries).map(([key, value]) => {
        return `${key}=${value}`;
    });

    const requestQuery = queries.join("&");

    const response = await getRequest(`reviews/profile/${profileId}?${requestQuery}`);
    const profileReviews = await response.data as ProfileReviewsType;
    return profileReviews;
}

export default getProfileReviews;