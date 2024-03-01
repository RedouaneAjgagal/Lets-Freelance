import JobFormTags from "./JobFormTags";
import JobFormDescription from "./JobFormDescription";
import JobFormLocationType from "./JobFormLocationType";
import { useAppSelector } from "../../../hooks/redux";

const JobFormStepTwo = () => {
    const jobFormReducer = useAppSelector(state => state.jobFormReducer);

    return (
        <section>
            <JobFormDescription isError={jobFormReducer.description.error.message !== ""} defaultValue={jobFormReducer.description.value} />
            <JobFormLocationType isError={jobFormReducer.locationType.error.message !== ""} defaultValue={jobFormReducer.locationType.value} />
            <JobFormTags isError={jobFormReducer.tags.error.message !== ""} defaultValue={jobFormReducer.tags.value} />
        </section>
    )
}

export default JobFormStepTwo