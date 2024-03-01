import toUpperCase from "../../../utils/toUpperCase";
import JobFormReviewWrapper from "./JobFormReviewWrapper";

type JobFormBudgetReviewProps = {
    formData: {
        priceType: "fixed" | "hourly";
        price: {
            min: string;
            max: string;
        };
    };
    navigateToStep: (step: number) => void;
}

const JobFormBudgetReview = (props: React.PropsWithoutRef<JobFormBudgetReviewProps>) => {

    const priceType = toUpperCase({
        value: props.formData.priceType
    });

    const minPrice = Number(props.formData.price.min).toFixed(2);
    const maxPrice = Number(props.formData.price.max).toFixed(2);

    return (
        <JobFormReviewWrapper navigateToStep={props.navigateToStep} step={3} stepTitle="Budget">
            <div className="flex gap-x-2 flex-wrap">
                <h2 className="font-medium">Project type:</h2>
                <p className="text-slate-600">{priceType} price job</p>
            </div>
            {props.formData.priceType === "hourly" ?
                <div className="flex items-center gap-10">
                    <div className="flex flex-col flex-wrap">
                        <h2 className="font-medium">From:</h2>
                        <p className="text-slate-600">${minPrice} / hr</p>
                    </div>
                    <div className="flex flex-col flex-wrap">
                        <h2 className="font-medium">To:</h2>
                        <p className="text-slate-600">${maxPrice} / hr</p>
                    </div>
                </div>
                : <div className="flex gap-x-2 flex-wrap">
                    <h2 className="font-medium">Budget:</h2>
                    <p className="text-slate-600">${maxPrice}</p>
                </div>
            }
        </JobFormReviewWrapper>
    )
}

export default JobFormBudgetReview