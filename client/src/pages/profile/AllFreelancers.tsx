import Loading from "../../components/Loading";
import { SearchFreelancersNav, SearchedFreelancers, useInfiniteSearchTalentsQuery } from "../../features/profile"
import FilterTalentsMenu from "../../features/profile/components/FilterTalentsMenu";


const AllFreelancers = () => {
    const infiniteSearchTalentsQuery = useInfiniteSearchTalentsQuery();

    return (
        <main className="">
            <div className="grid grid-cols-1 lg:grid-cols-12 xl:gap-2">
                <div className="hidden lg:grid lg:grid-cols-1 lg:col-span-3 lg:py-8">
                    <FilterTalentsMenu isDesktopLayout />
                </div>
                <div className="col-span-1 lg:col-span-9">
                    <SearchFreelancersNav />
                    {infiniteSearchTalentsQuery.isLoading
                        ? <div className="p-4">
                            <Loading type="cards" display="column" numOfCards={4} />
                        </div>
                        : <div>
                            {infiniteSearchTalentsQuery.data!.pages.map((group, index) => (
                                <SearchedFreelancers key={index} telents={group.talents} fetchNextPage={infiniteSearchTalentsQuery.fetchNextPage} cursor={group.cursor} />
                            ))}
                        </div>
                    }
                </div>
            </div>
        </main>
    )
}

export default AllFreelancers