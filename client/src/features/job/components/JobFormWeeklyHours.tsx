import Input from "../../../components/Input";

type JobFormWeeklyHoursProps = {
    isError: boolean;
    defaultValue: {
        min: number;
        max: number;
    };
}

const JobFormWeeklyHours = (props: React.PropsWithoutRef<JobFormWeeklyHoursProps>) => {
    const weeklyHoursOptions = ["min", "max"] as const;

    const weeklyHoursInputs = weeklyHoursOptions.map(value => {

        const defaultValue = props.defaultValue[value] === 0 ? ""
            : props.defaultValue[value];
        return (
            <Input key={value} errorMsg="" id={`job_weeklyHours_${value}`} includeLabel={false} isError={props.isError} name={`job_weeklyHours_${value}`} type="number" defaultValue={defaultValue} placeHolder={value} />
        )
    });

    return (
        <div className="flex flex-col gap-1">
            <span className="text-lg font-medium cursor-default">Weekly hours</span>
            <div className="flex items-center gap-4">
                {weeklyHoursInputs}
            </div>
        </div>
    )
}

export default JobFormWeeklyHours