import getFreelancerProposals from "../service/getFreelancerProposals"
import { useQuery } from "@tanstack/react-query"
import { useAppSelector } from "../../../hooks/redux"

const useFreelancerProposalsQuery = () => {
  const { userInfo } = useAppSelector(state => state.authReducer);
  
  const freelancerProposalsQuery = useQuery({
    queryKey: ["freelancerProposals", userInfo!.profileId],
    queryFn: getFreelancerProposals,
    retry: false,
    refetchOnWindowFocus: false
  });

  return freelancerProposalsQuery;
}

export default useFreelancerProposalsQuery