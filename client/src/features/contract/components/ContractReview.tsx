import { ContractReviewType } from "../services/getUserSingleContract";
import ContractReviewContainer from "./ContractReviewContainer";
import ContractReviewForm from "./ContractReviewForm";

type ContractReviewProps = {
    review: ContractReviewType | undefined;
}

const ContractReview = (props: React.PropsWithoutRef<ContractReviewProps>) => {
    return (
        <div className="mt-2">
            {props.review ?
                <ContractReviewContainer review={props.review} />
                : <ContractReviewForm type="create" />
            }
        </div>
    )
}

export default ContractReview