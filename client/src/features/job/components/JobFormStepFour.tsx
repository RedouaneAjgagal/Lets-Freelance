import JobFormDuration from "./JobFormDuration"
import JobFormWeeklyHours from "./JobFormWeeklyHours"

type JobFormStepFourProps = {
    isCurrentStep: boolean;
    errors: {
        weeklyHours: boolean;
        duration: boolean;
    };
};

const JobFormStepFour = (props: React.PropsWithoutRef<JobFormStepFourProps>) => {
    return (
        <section className={`${props.isCurrentStep ? "flex flex-col not-sr-only" : "hidden sr-only"}`}>
            <JobFormWeeklyHours isError={props.errors.weeklyHours} />
            <JobFormDuration isError={props.errors.duration} />
        </section>
    )
}

export default JobFormStepFour