import getFreelancerServices from "../services/getFreelancerServices";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../../hooks/redux";

const useFreelancerServicesQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    
    const freelancerServicesQuery = useQuery({
        queryKey: ["freelancerServices", userInfo!.profileId],
        queryFn: getFreelancerServices,
        retry: false,
        refetchOnWindowFocus: false
    });

    return freelancerServicesQuery;
}

export default useFreelancerServicesQuery