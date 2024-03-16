import { ContractReviewType } from "../services/getUserSingleContract";
import ContractReviewContainer from "./ContractReviewContainer";

type ContractReviewProps = {
    review: ContractReviewType | undefined;
}

const ContractReview = (props: React.PropsWithoutRef<ContractReviewProps>) => {
    return (
        <div>
            {props.review ?
                <ContractReviewContainer review={props.review} />
                : <p>Create review form</p>
            }
        </div>
    )
}

export default ContractReview