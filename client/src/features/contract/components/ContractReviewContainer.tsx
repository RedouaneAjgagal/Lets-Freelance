import { useState } from "react";
import { ContractReviewType } from "../services/getUserSingleContract"
import ViewContractReview from "./ViewContractReview";
import ContractReviewForm from "./ContractReviewForm";
import { useUpdateReviewMutation } from "../../reviews";

type ContractReviewContainerProps = {
    review: ContractReviewType;
}

const ContractReviewContainer = (props: React.PropsWithoutRef<ContractReviewContainerProps>) => {
    const updateReviewMutation = useUpdateReviewMutation({
        contractId: props.review.contract
    });

    const [isUpdateReview, setIsUpdateReview] = useState(false);

    const toggleUpdateReview = () => {
        setIsUpdateReview(prev => !prev);
    }

    return (isUpdateReview ?
        <ContractReviewForm type="update" onClose={toggleUpdateReview} review={props.review} onSubmit={updateReviewMutation} />
        : <ViewContractReview review={props.review} onUpdateReview={toggleUpdateReview} />
    )
}

export default ContractReviewContainer