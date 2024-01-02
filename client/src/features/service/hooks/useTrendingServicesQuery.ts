import { useQuery } from "@tanstack/react-query";
import getTrendingServices from "../services/getTrendingServices";

const useTrendingServicesQuery = () => {
    const trendingServices = useQuery({
        queryKey: ["trendingServices"],
        queryFn: getTrendingServices,
        refetchOnWindowFocus: false
    });

    return trendingServices;
}

export default useTrendingServicesQuery;