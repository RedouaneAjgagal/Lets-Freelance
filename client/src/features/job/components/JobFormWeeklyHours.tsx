import Input from "../../../components/Input";

const JobFormWeeklyHours = () => {
    const weeklyHoursOptions = ["min", "max"] as const;

    const weeklyHoursInputs = weeklyHoursOptions.map(value => {
        return (
            <Input key={value} errorMsg="" id={`job_weeklyHours_${value}`} includeLabel={false} isError={false} name={`job_weeklyHours_${value}`} type="number" defaultValue="" placeHolder={value} />
        )
    });

    return (
        <div className="flex flex-col gap-1">
            <span className="text-lg font-medium">Weekly hours</span>
            <div className="flex items-center gap-4">
                {weeklyHoursInputs}
            </div>
        </div>
    )
}

export default JobFormWeeklyHours