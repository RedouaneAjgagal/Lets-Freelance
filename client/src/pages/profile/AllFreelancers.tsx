import Loading from "../../components/Loading";
import { SearchFreelancersNav, SearchedFreelancers, useSearchTalentsQuery } from "../../features/profile"


const AllFreelancers = () => {
    const searchTalentsQuery = useSearchTalentsQuery({});

    return (
        <main>
            <SearchFreelancersNav />
            {searchTalentsQuery.isLoading ?
                <Loading />
                : <SearchedFreelancers telents={searchTalentsQuery.data!} />
            }
        </main>
    )
}

export default AllFreelancers