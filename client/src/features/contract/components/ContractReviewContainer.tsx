import { useState } from "react";
import { ContractReviewType } from "../services/getUserSingleContract"
import ViewContractReview from "./ViewContractReview";
import ContractReviewForm from "./ContractReviewForm";

type ContractReviewContainerProps = {
    review: ContractReviewType;
}

const ContractReviewContainer = (props: React.PropsWithoutRef<ContractReviewContainerProps>) => {
    const [isUpdateReview, setIsUpdateReview] = useState(false);

    const toggleUpdateReview = () => {
        console.log(true);
        
        setIsUpdateReview(prev => !prev);
    }



    return (isUpdateReview ?
        <ContractReviewForm type="update" onClose={toggleUpdateReview} review={props.review} />
        : <ViewContractReview review={props.review} onUpdateReview={toggleUpdateReview} />
    )
}

export default ContractReviewContainer