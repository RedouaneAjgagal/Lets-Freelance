import JobFormTags from "./JobFormTags";
import JobFormDescription from "./JobFormDescription";
import JobFormLocationType from "./JobFormLocationType";

type JobFormStepTwoProps = {
    errors: {
        description: boolean;
        locationType: boolean;
        tags: boolean;
    };
};

const JobFormStepTwo = (props: React.PropsWithoutRef<JobFormStepTwoProps>) => {

    return (
        <section>
            <JobFormDescription isError={props.errors.description} />
            <JobFormLocationType isError={props.errors.locationType} />
            <JobFormTags isError={props.errors.tags} />
        </section>
    )
}

export default JobFormStepTwo