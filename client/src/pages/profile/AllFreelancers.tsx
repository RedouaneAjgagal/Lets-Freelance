import Loading from "../../components/Loading";
import { SearchFreelancersNav, SearchedFreelancers, useInfiniteSearchTalentsQuery } from "../../features/profile"


const AllFreelancers = () => {
    const infiniteSearchTalentsQuery = useInfiniteSearchTalentsQuery();

    return (
        <main>
            <SearchFreelancersNav />
            {infiniteSearchTalentsQuery.isLoading
                ? <div className="p-4">
                    <Loading type="cards" display="column" numOfCards={4} />
                </div>
                : infiniteSearchTalentsQuery.data!.pages.map((group, index) => (
                    <SearchedFreelancers key={index} telents={group.talents} fetchNextPage={infiniteSearchTalentsQuery.fetchNextPage} cursor={group.cursor} />
                ))
            }
        </main>
    )
}

export default AllFreelancers