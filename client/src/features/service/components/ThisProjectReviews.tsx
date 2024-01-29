import { useServiceReviewsQuery } from '../../reviews';
import Loading from '../../../components/Loading';
import Review from '../../../components/Review';

const ThisProjectReviews = () => {
    const serviceReviewsQuery = useServiceReviewsQuery();

    return (
        serviceReviewsQuery.isLoading ?
            <Loading />
            :
            serviceReviewsQuery.data!.length ?
                <ul className="flex flex-col gap-5">
                    {serviceReviewsQuery.data!.map(review => <Review key={review._id} profile={review.employer} rating={review.rating} description={review.description} createdAt={review.createdAt} />)}
                </ul>
                :
                <p className="text-slate-600">Empty..</p>
    )
}

export default ThisProjectReviews