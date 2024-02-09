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
        <div>
            <PrimaryButton disabled={!props.hasNextPage || props.isFetchingNextPage} fullWith justifyConent="center" style="outline" type="button" x="md" y="md" onClick={loadMoreServicesHandler} >
                {props.isFetchingNextPage ?
                    "Loading more..."
                    : props.hasNextPage
                        ? <>
                            Load more
                            <BiArrowBack className="rotate-[-90deg]" />
                        </>
                        : "Found no more services.."
                }
            </PrimaryButton>
        </div>
    )
}

export default LoadMoreServices