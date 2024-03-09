import { getRequest } from "../../../services/api";
import { Category } from "../../profile/helpers/getFormatedCategory";

export type FreelancerServiceType = {
    _id: string;
    title: string;
    category: Category;
    createdAt: string;
    totalRevenue: number;
    inQueue: number;
    hasContracts: boolean;
};

export type FreelancerServicesType = FreelancerServiceType[];

const getFreelancerServices = async () => {
    const response = await getRequest("services/profile/freelancer-services");
    const freelancerServices = await response.data as FreelancerServicesType;
    return freelancerServices;
}

export default getFreelancerServices;