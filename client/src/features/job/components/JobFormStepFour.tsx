import JobFormDuration from "./JobFormDuration"
import JobFormWeeklyHours from "./JobFormWeeklyHours"


const JobFormStepFour = () => {
    return (
        <section>
            <JobFormWeeklyHours />
            <JobFormDuration />
        </section>
    )
}

export default JobFormStepFour