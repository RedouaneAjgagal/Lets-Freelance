import { BiArrowBack } from "react-icons/bi";
import { PrimaryButton } from "../../../layouts/brand";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { SearchServicesType } from "../services/searchServices";

type LoadMoreServicesProps = {
    onLoadMore: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<SearchServicesType, unknown>>
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
}

const LoadMoreServices = (props: React.PropsWithoutRef<LoadMoreServicesProps>) => {
    const loadMoreServicesHandler = () => {
        props.onLoadMore();
    }

    return (
        props.hasNextPage ?
            <div>
                <PrimaryButton disabled={!props.hasNextPage || props.isFetchingNextPage} fullWith justifyConent="center" style="outline" type="button" x="md" y="md" onClick={loadMoreServicesHandler} >
                    {props.isFetchingNextPage ?
                        "Loading more..."
                        : <>
                            Load more
                            <BiArrowBack className="rotate-[-90deg]" />
                        </>
                    }
                </PrimaryButton>
            </div>
            : null
    )
}

export default LoadMoreServices