import { FetchNextPageOptions, InfiniteData, useQueryClient } from '@tanstack/react-query';
import NoMatchErrorMessage from '../../../components/NoMatchErrorMessage';
import { GetFreelancersResponse, SearchedTalentType } from '../services/getFreelancers'
import SearchedFreelancerCard from './SearchedFreelancerCard'
import { useEffect } from 'react';

type SearchedFreelancersProps = {
    telents: SearchedTalentType[];
    fetchNextPage: (options?: FetchNextPageOptions) => void;
    cursor: number | null;
}

const SearchedFreelancers = (props: React.PropsWithoutRef<SearchedFreelancersProps>) => {
    const queryClient = useQueryClient();

    // avoid refetching all pages that has been fetched before changing the page and refetch only page 1
    useEffect(() => {
        const talentsQuery = queryClient.getQueryData(["talents"]);
        if (talentsQuery && props.cursor) {
            queryClient.setQueryData<InfiniteData<GetFreelancersResponse>>(['talents'], (data) => {
                if (!data) return;

                return {
                    pages: data.pages.slice(0, props.cursor!),
                    pageParams: data.pageParams.slice(0, props.cursor!),
                }
            });
        }
    }, []);


    return (
        <ul>
            {props.telents.length ?
                props.telents.map((talent, index) => <SearchedFreelancerCard key={talent._id} talent={talent} fetchNextPage={props.fetchNextPage} index={index} cursor={props.cursor} />)
                : <NoMatchErrorMessage />
            }
        </ul>
    )
}

export default SearchedFreelancers