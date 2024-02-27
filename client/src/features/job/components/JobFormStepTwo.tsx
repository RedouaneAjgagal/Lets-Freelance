import JobFormTags from "./JobFormTags";
import JobFormDescription from "./JobFormDescription";
import JobFormLocationType from "./JobFormLocationType";

const JobFormStepTwo = () => {

    return (
        <section>
            <JobFormDescription />
            <JobFormLocationType />
            <JobFormTags />
        </section>
    )
}

export default JobFormStepTwo