import { useState } from "react";
import Ratings from "../../../components/Ratings";
import ActionModal from "../../../layouts/ActionModal";
import ActionButton from "../../../layouts/brand/ActionButton";
import formatDate from "../../../utils/formatDate";
import { ContractReviewType } from "../services/getUserSingleContract";
import { useDeleteReviewMutation } from "../../reviews";

type ViewContractReviewProps = {
    review: ContractReviewType;
    onUpdateReview: () => void;
}

const ViewContractReview = (props: React.PropsWithoutRef<ViewContractReviewProps>) => {
    const [isDeleteReviewModal, setIsDeleteReviewModal] = useState(false);

    const deleteReviewMutation = useDeleteReviewMutation({
        contractId: props.review.contract
    });

    const postedAt = formatDate(props.review.createdAt);

    const isUpdated = new Date(props.review.createdAt).getTime() !== new Date(props.review.updatedAt).getTime();
    const updatedAt = formatDate(props.review.updatedAt);


    const deleteReviewHandler = () => {
        deleteReviewMutation.mutate({
            reviewId: props.review._id
        });
    }

    return (
        <>
            {isDeleteReviewModal ?
                <ActionModal onClose={() => setIsDeleteReviewModal(false)} cancelBtnContent="Cancel" color="red" confirmBtnContent="Delete" desc="Are you sure you want to delete this review? This action can't be undone." disabled={deleteReviewMutation.isLoading} isLoading={deleteReviewMutation.isLoading} onConfirm={deleteReviewHandler} title="Review deletion" />
                : null
            }
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
                {props.review.description ?
                    <p className="text-slate-600 text-[.95rem]">
                        <em>"{props.review.description}"</em>
                    </p>
                    : <p className="text-slate-600">
                        <strong className="text-slate-800">Description: </strong>
                        Empty..
                    </p>
                }
                <div className="flex items-center gap-2 self-end">
                    <ActionButton type="edit" disabled={false} onClick={props.onUpdateReview} />
                    <ActionButton type="delete" disabled={false} onClick={() => setIsDeleteReviewModal(true)} minimized />

                </div>
            </article>
        </>
    )
}

export default ViewContractReview