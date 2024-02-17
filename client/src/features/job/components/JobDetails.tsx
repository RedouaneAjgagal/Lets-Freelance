import { JobType } from "../service/getJobs";

type JobDetailsProps = {
    jobDetail: {
        price: JobType["price"];
        priceType: JobType["priceType"];
        experienceLevel: JobType["experienceLevel"];
        duration: JobType["duration"];
        weeklyHours: JobType["weeklyHours"];

    }
}

const JobDetails = (props: React.PropsWithoutRef<JobDetailsProps>) => {
    const priceType = {
        fixed: "Fixed price",
        hourly: `Hourly: $${props.jobDetail.price.min.toFixed(2)} - $${props.jobDetail.price.max.toFixed(2)}`
    } as const;

    const experienceLevels = {
        expert: "Expert",
        intermediate: "Intermediate",
        entryLevel: "Entry level"
    } as const;

    const jobDetails: string[] = [
        priceType[props.jobDetail.priceType],
        experienceLevels[props.jobDetail.experienceLevel]
    ];

    if (props.jobDetail.duration) {
        const duration = {
            date: props.jobDetail.duration.dateValue === 1 ? props.jobDetail.duration.dateType.slice(0, -1) : props.jobDetail.duration.dateType,
            value: props.jobDetail.duration.dateValue
        }

        jobDetails.push(`Est. time: ${duration.value} ${duration.date}`)
    }

    const weeklyHours = props.jobDetail.weeklyHours.max === props.jobDetail.weeklyHours.min ?
        `${props.jobDetail.weeklyHours.max} hours per week`
        :
        `Between ${props.jobDetail.weeklyHours.min} & ${props.jobDetail.weeklyHours.max} hours per week`;


    jobDetails.push(weeklyHours)

    if (props.jobDetail.priceType === "fixed") {
        jobDetails.push(`Budget: $${props.jobDetail.price.max.toFixed(2)}`)
    }

    const jobDetail = jobDetails.join(" - ");

    return (
        <strong className="text-gray-500 font-medium text-[0.85rem] ">
            {jobDetail}
        </strong>
    )
}

export default JobDetails