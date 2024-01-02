import { getRequest } from "../../../services/api";
import getFormatedCategory, { Category } from "../helpers/getFormatedCategory";

export type HighRatedFreelancerType = {
    _id: string;
    name: string;
    avatar: string;
    category: Category
    roles: {
        freelancer: {
            hourlyRate: number;
            skills: [];
        };
    };
    rating: {
        avgRate: number | undefined;
        numOfReviews: number;
    };
    country: string | undefined;
    isFavourite: 0 | 1;
}



const getHighRatedFreelancers = async (category?: Category) => {
    let requestQuery = "";

    if (category) {
        const formatedCategory = getFormatedCategory(category);
        requestQuery = `?category=${formatedCategory}`;
    };

    const response = await getRequest(`profiles/high-rated${requestQuery}`);
    const highRatedFreelancers = await response.data as HighRatedFreelancerType[];
    return highRatedFreelancers;
};

export default getHighRatedFreelancers;