import { useQuery } from "@tanstack/react-query";
import getSingleProfileInfo from "../services/getSingleProfileInfo";
import { useParams } from "react-router-dom";

const useSingleProfileQuery = () => {
    const { profileId } = useParams();
    const singleProfileQuery = useQuery({
        queryKey: ["singleProfile", profileId],
        queryFn: getSingleProfileInfo.bind(null, profileId!)
    });
    return singleProfileQuery;
}

export default useSingleProfileQuery;