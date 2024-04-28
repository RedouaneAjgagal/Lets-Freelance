import { useQuery } from '@tanstack/react-query';
import React from 'react'
import getFreelancers, { GetFreelancersPayload } from '../services/getFreelancers';

const useSearchTalentsQuery = (payload: GetFreelancersPayload) => {
    const searchTalentsQuery = useQuery({
        queryKey: ["telents"],
        queryFn: () => getFreelancers(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return searchTalentsQuery;
}

export default useSearchTalentsQuery