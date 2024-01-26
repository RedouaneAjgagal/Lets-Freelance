import Loading from "../../components/Loading";
import { useSingleServiceQuery } from "../../features/service";
import { SingleServiceContainer } from "../../features/service";


const SingleService = () => {
    const singleServiceQuery = useSingleServiceQuery();

    return (
        singleServiceQuery.isLoading ?
            <Loading />
            :
            <SingleServiceContainer serviceInfo={singleServiceQuery.data!} />
    )
}

export default SingleService