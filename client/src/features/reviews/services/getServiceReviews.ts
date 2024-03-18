import { getRequest } from "../../../services/api"

export type ServiceReviewType = {
    _id: string;
    employer: {
        _id: string;
        name: string;
        avatar: string;
    };
    activityTitle: string;
    description?: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
};

const getServiceReviews = async (serviceId: string) => {
    const response = await getRequest(`reviews?service_id=${serviceId}`);
    const serviceReviews = await response.data as ServiceReviewType[];
    return serviceReviews;
}

export default getServiceReviews;