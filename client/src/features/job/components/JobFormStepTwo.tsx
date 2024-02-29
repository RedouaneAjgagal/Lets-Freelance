import JobFormTags from "./JobFormTags";
import JobFormDescription from "./JobFormDescription";
import JobFormLocationType from "./JobFormLocationType";

type JobFormStepTwoProps = {
    isCurrentStep: boolean;
    errors: {
        description: boolean;
        locationType: boolean;
        tags: boolean;
    };
};

const JobFormStepTwo = (props: React.PropsWithoutRef<JobFormStepTwoProps>) => {

    return (
        <section className={`${props.isCurrentStep ? "flex flex-col not-sr-only" : "hidden sr-only"}`}>
            <JobFormDescription isError={props.errors.description} />
            <JobFormLocationType isError={props.errors.locationType} />
            <JobFormTags isError={props.errors.tags} />
        </section>
    )
}

export default JobFormStepTwo