import { useAppSelector } from "../../../hooks/redux"
import JobFormBudgetReview from "./JobFormBudgetReview";
import JobFormDescriptionReview from "./JobFormDescriptionReview";
import JobFormTitleReview from "./JobFormTitleReview";
import JobFormWorkTimeReview from "./JobFormWorkTimeReview";

type JobFormReviewProps = {
    onChangeStep: (step: number) => void;
}

const JobFormReview = (props: React.PropsWithoutRef<JobFormReviewProps>) => {
    const jobFormReducer = useAppSelector(state => state.jobFormReducer);


    return (
        <section className="flex flex-col gap-4">
            <JobFormTitleReview navigateToStep={props.onChangeStep} formData={{
                title: jobFormReducer.title.value,
                category: jobFormReducer.category.value,
                experienceLevel: jobFormReducer.experienceLevel.value
            }} />
            <JobFormDescriptionReview navigateToStep={props.onChangeStep} formData={{
                description: jobFormReducer.description.value,
                locationType: jobFormReducer.locationType.value,
                tags: jobFormReducer.tags.value
            }} />
            <JobFormBudgetReview navigateToStep={props.onChangeStep} formData={{
                priceType: jobFormReducer.priceType.value,
                price: jobFormReducer.price.value
            }} />
            <JobFormWorkTimeReview navigateToStep={props.onChangeStep} formData={{
                weeklyHours: jobFormReducer.weeklyHours.value,
                duration: jobFormReducer.duration.value
            }} />
        </section>
    )
}

export default JobFormReview