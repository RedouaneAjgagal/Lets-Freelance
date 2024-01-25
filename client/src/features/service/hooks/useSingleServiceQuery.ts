import { useQuery } from "@tanstack/react-query"
import getSingleService from "../services/getSingleService"
import { useParams } from "react-router-dom"

const useSingleServiceQuery = () => {
    const { serviceId } = useParams();

    console.log(serviceId);


    const singleServiceQuery = useQuery({
        queryKey: ["services", serviceId!],
        queryFn: () => getSingleService(serviceId!),
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });

    return singleServiceQuery;
}

export default useSingleServiceQuery