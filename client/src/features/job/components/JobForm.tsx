import { PrimaryButton } from "../../../layouts/brand";
import JobFormStepFour from "./JobFormStepFour";
import JobFormStepOne from "./JobFormStepOne";
import JobFormStepThree from "./JobFormStepThree";
import JobFormStepTwo from "./JobFormStepTwo";

type JobFormProps = {
    formType: "create" | "update";
}

const JobForm = (props: React.PropsWithoutRef<JobFormProps>) => {

    const createJobHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const title = form.get("job_title");
        const category = form.get("job_category");
        const experienceLevel = form.get("job_experienceLevel");
        const description = form.get("job_description");
        const plainDescription = form.get("job_plainDescription");
        const jobLocation = form.get("job_locationType");
        const jobTag = form.get("job_tag");
        const tags = jobTag?.toString().split("***");
        const priceType = form.get("job_priceType");
        const minPrice = form.get("job_price_min");
        const maxPrice = form.get("job_price_max");
        const budget = form.get("job_price_budget");
        const minWeeklyHours = form.get("job_weeklyHours_min");
        const maxWeeklyHours = form.get("job_weeklyHours_max");
        const durationType = form.get("job_duration_type");
        const durationValue = form.get("job_duration_value");


        console.log({
            title,
            category,
            experienceLevel,
            description,
            plainDescription,
            jobLocation,
            tags,
            priceType,
            minPrice,
            maxPrice,
            budget,
            minWeeklyHours,
            maxWeeklyHours,
            durationType,
            durationValue
        });
    }

    const submitFormButtonContent = props.formType === "create" ? "Submit" : "Update";

    return (
        <form onSubmit={createJobHandler}>
            {/* <JobFormStepOne /> */}
            {/* <JobFormStepTwo /> */}
            {/* <JobFormStepThree /> */}
            <JobFormStepFour />
            <PrimaryButton disabled={false} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md">{submitFormButtonContent}</PrimaryButton>
        </form>
    )
}

export default JobForm