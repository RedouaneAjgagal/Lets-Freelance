import JobFormReviewWrapper from "./JobFormReviewWrapper";

type JobFormWorkTimeReviewProps = {
    formData: {
        weeklyHours: {
            min: string;
            max: string;
        };
        duration: {
            dateType: "hours" | "days" | "months";
            dateValue: string;
        };
    };
    navigateToStep: (step: number) => void;
};

const JobFormWorkTimeReview = (props: React.PropsWithoutRef<JobFormWorkTimeReviewProps>) => {

    const jobDurationPluralizeType = props.formData.duration.dateValue === "1" ? "" : "s";
    const jobDuration = `${props.formData.duration.dateValue} ${props.formData.duration.dateType.slice(0, -1)}${jobDurationPluralizeType}`;


    const weeklyHours = `From ${props.formData.weeklyHours.min}, to ${props.formData.weeklyHours.max} hours`;

    return (
        <JobFormReviewWrapper navigateToStep={props.navigateToStep} step={4} stepTitle="Work time">
            <div className="flex gap-x-2 flex-wrap">
                <h2 className="font-medium">Weekly hours:</h2>
                <p className="text-slate-600">{weeklyHours}</p>
            </div>
            <div className="flex gap-x-2 flex-wrap">
                <h2 className="font-medium">Job duration:</h2>
                <p className="text-slate-600">{jobDuration}</p>
            </div>
        </JobFormReviewWrapper>
    )
}

export default JobFormWorkTimeReview