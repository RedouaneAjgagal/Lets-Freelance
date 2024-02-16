import { useQuery } from "@tanstack/react-query"
import getSingleService from "../services/getSingleService"
import { useParams } from "react-router-dom"

type UseSingleServiceQueryPayload = {
    isForm?: false;
}

type UseSingleServiceQueryFormPayload = {
    isForm: true;
    formType: "create" | "update";
}

const useSingleServiceQuery = (payload: UseSingleServiceQueryPayload | UseSingleServiceQueryFormPayload) => {
    const { serviceId } = useParams();

    if (payload.isForm && payload.formType === "create") {
        return;
    }
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