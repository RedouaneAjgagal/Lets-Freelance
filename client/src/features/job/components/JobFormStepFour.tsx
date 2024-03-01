import { useAppSelector } from "../../../hooks/redux"
import JobFormDuration from "./JobFormDuration"
import JobFormWeeklyHours from "./JobFormWeeklyHours"

const JobFormStepFour = () => {
    const jobFormReducer = useAppSelector(state => state.jobFormReducer);

    return (
        <section>
            <JobFormWeeklyHours isError={jobFormReducer.weeklyHours.error.message !== ""} defaultValue={jobFormReducer.weeklyHours.value} />
            <JobFormDuration isError={jobFormReducer.duration.error.message !== ""} defaultValue={jobFormReducer.duration.value} />
        </section>
    )
}

export default JobFormStepFour