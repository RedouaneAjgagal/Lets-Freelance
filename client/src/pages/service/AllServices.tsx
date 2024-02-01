import Loading from "../../components/Loading";
import { useSearchServicesQuery } from "../../features/service"

const AllServices = () => {

    const searchedServicesQuery = useSearchServicesQuery({
        category: "programming-tech",
        search: "react",
        page: 1
    });
    
    
    return (
        searchedServicesQuery.isLoading ?
        <Loading />
        :
        <h1>Pages Exist: {searchedServicesQuery.data!.numOfPages}</h1>
    )
}

export default AllServices