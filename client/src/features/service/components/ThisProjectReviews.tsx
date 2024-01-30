import Review from '../../../components/Review';
import { ServiceReviewType } from '../../reviews/services/getServiceReviews';

type ThisProjectReviewsProps = {
    reviews: ServiceReviewType[];
}

const ThisProjectReviews = (props: React.PropsWithoutRef<ThisProjectReviewsProps>) => {

    return (
        props.reviews.length ?
            <ul className="flex flex-col gap-5">
                {props.reviews.map(review => <Review key={review._id} profile={review.employer} rating={review.rating} description={review.description} createdAt={review.createdAt} />)}
            </ul>
            :
            <p className="text-slate-600">Empty..</p>
    )
}

export default ThisProjectReviews