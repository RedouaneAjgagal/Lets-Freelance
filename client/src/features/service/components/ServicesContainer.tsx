import { FetchNextPageOptions, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { SearchServicesType } from "../services/searchServices"
import SearchServicesHeader from "./SearchServicesHeader"
import SearchedServices from "./SearchedServices"
import LoadMoreServices from "./LoadMoreServices";
import React from "react";
import NoMatchErrorMessage from "../../../components/NoMatchErrorMessage";

type ServicesContainerProps = {
    pages: SearchServicesType[]
    onLoadMore: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<SearchServicesType, unknown>>;
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
}

const ServicesContainer = (props: React.PropsWithoutRef<ServicesContainerProps>) => {
    return (
        <div className="flex flex-col gap-4">
            <SearchServicesHeader numOfServices={props.pages[0].numOfServices} />
            {
                props.pages.map((page, index) => (
                    page.services.length ?
                        <SearchedServices key={index} services={page.services} />
                        : <NoMatchErrorMessage key={index} />
                ))
            }
            <LoadMoreServices onLoadMore={props.onLoadMore} isFetchingNextPage={props.isFetchingNextPage} hasNextPage={props.hasNextPage} />
        </div>
    )
}

export default ServicesContainer