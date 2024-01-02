import { useQuery } from "@tanstack/react-query";
import getHighRatedFreelancers from "../services/getHighRatedFreelancers";


const useHighRatedFreelancersQuery = () => {
    const highRatedFreelancersQuery = useQuery({
        queryKey: ["highRatedFreelancers"],
        queryFn: () => getHighRatedFreelancers(),
        refetchOnWindowFocus: false
    });

    return highRatedFreelancersQuery;
}

export default useHighRatedFreelancersQuery;
