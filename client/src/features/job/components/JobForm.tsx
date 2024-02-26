import Input from "../../../components/Input";
import SelectOptions from "../../../components/SelectOptions";
import { PrimaryButton } from "../../../layouts/brand";
import JobFormStepOne from "./JobFormStepOne";

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
        console.log({
            title,
            category,
            experienceLevel
        });
    }

    const submitFormButtonContent = props.formType === "create" ? "Submit" : "Update";

    return (
        <form onSubmit={createJobHandler}>
            <JobFormStepOne />
            <PrimaryButton disabled={false} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md">{submitFormButtonContent}</PrimaryButton>
        </form>
    )
}

export default JobForm