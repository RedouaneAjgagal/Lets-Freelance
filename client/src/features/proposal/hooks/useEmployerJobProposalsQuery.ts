import { useQuery } from '@tanstack/react-query';
import getEmployerJobProposals from '../service/getEmployerJobProposals';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';

const useEmployerJobProposalsQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const { jobId } = useParams();

    const employerProposalsQuery = useQuery({
        queryKey: ["employerProposals", userInfo!.profileId],
        queryFn: () => getEmployerJobProposals({
            jobId: jobId!
        }),
        retry: false,
        refetchOnWindowFocus: false
    });

    return employerProposalsQuery;
}

export default useEmployerJobProposalsQuery