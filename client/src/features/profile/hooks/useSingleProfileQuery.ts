import { useQuery } from "@tanstack/react-query";
import getSingleProfileInfo from "../services/getSingleProfileInfo";

type SingleProfileQueryPayload = {
    profileId: string;
}

const useSingleProfileQuery = (payload: SingleProfileQueryPayload) => {
    const singleProfileQuery = useQuery({
        queryKey: ["profiles", payload.profileId],
        queryFn: () => getSingleProfileInfo({
            profileId: payload.profileId
        }),
        refetchOnWindowFocus: false
    });
    return singleProfileQuery;
}

export default useSingleProfileQuery;