import { useCreateReviewMutaion } from "../../reviews";
import { ContractReviewType } from "../services/getUserSingleContract";
import ContractReviewContainer from "./ContractReviewContainer";
import ContractReviewForm from "./ContractReviewForm";

type ContractReviewProps = {
    review: ContractReviewType | undefined;
    contractId: string
}

const ContractReview = (props: React.PropsWithoutRef<ContractReviewProps>) => {
    const createReviewMutaion = useCreateReviewMutaion({
        contractId: props.contractId
    });

    return (
        <div className="mt-2">
            {props.review ?
                <ContractReviewContainer review={props.review} />
                : <ContractReviewForm type="create" onSubmit={createReviewMutaion} />
            }
        </div>
    )
}

export default ContractReview