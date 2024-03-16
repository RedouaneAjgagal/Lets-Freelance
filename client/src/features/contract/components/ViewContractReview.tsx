import Ratings from "../../../components/Ratings";
import formatDate from "../../../utils/formatDate";
import { ContractReviewType } from "../services/getUserSingleContract";

type ViewContractReviewProps = {
    review: ContractReviewType;
}

const ViewContractReview = (props: React.PropsWithoutRef<ViewContractReviewProps>) => {
    const postedAt = formatDate(props.review.createdAt);

    const isUpdated = new Date(props.review.createdAt).getTime() !== new Date(props.review.updatedAt).getTime();
    const updatedAt = formatDate(props.review.createdAt);

    return (
        <article className="flex flex-col gap-3">
            <div className="flex items-center gap-x-1 flex-wrap">
                <Ratings maxStars={5} rate={props.review.rating} size="text-sm" />
                <strong className="font-medium">{props.review.rating.toFixed(2)}</strong>
                <small className="text-slate-500">{postedAt}</small>
                {isUpdated ?
                    <small className="text-slate-500">(Updated at: {updatedAt})</small>
                    : null
                }
            </div>
            <p className="text-slate-600 text-[.95rem]">
                <em>"{props.review.description}"</em>
            </p>
        </article>
    )
}

export default ViewContractReview