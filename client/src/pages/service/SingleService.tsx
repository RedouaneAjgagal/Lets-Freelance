import Loading from "../../components/Loading";
import { useSingleServiceQuery } from "../../features/service";


const SingleService = () => {
    const singleQueryService = useSingleServiceQuery();

    return (
        singleQueryService.isLoading ?
            <Loading />
            :
            <h1>{singleQueryService.data?.title}</h1>
    )
}

export default SingleService