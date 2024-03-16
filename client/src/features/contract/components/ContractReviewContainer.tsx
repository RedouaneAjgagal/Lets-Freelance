import { useState } from "react";
import { ContractReviewType } from "../services/getUserSingleContract"
import ViewContractReview from "./ViewContractReview";

type ContractReviewContainerProps = {
    review: ContractReviewType;
}

const ContractReviewContainer = (props: React.PropsWithoutRef<ContractReviewContainerProps>) => {
    const [isUpdateReview, setIsUpdateReview] = useState(false);

    return (isUpdateReview ?
        <p>Update review form</p>
        : <ViewContractReview review={props.review} />
    )
}

export default ContractReviewContainer