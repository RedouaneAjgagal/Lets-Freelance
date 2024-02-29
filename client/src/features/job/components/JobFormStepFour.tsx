import JobFormDuration from "./JobFormDuration"
import JobFormWeeklyHours from "./JobFormWeeklyHours"

type JobFormStepFourProps = {
    errors: {
        weeklyHours: boolean;
        duration: boolean;
    };
};

const JobFormStepFour = (props: React.PropsWithoutRef<JobFormStepFourProps>) => {
    return (
        <section>
            <JobFormWeeklyHours isError={props.errors.weeklyHours} />
            <JobFormDuration isError={props.errors.duration} />
        </section>
    )
}

export default JobFormStepFour