import toUpperCase from "../../../utils/toUpperCase";

const JobFormLocationType = () => {
    const locationTypes = ["remote", "onsite"] as const;

    const locationInputs = locationTypes.map(locationType => {
        const labelContent = toUpperCase({ value: locationType });

        return (
            <div className="flex gap-2" key={locationType}>
                <input className="accent-purple-600" type="radio" name="job_locationType" id={`job_locationType_${locationType}`} value={locationType} defaultChecked={locationType === "remote"} />
                <label className="font-medium" htmlFor={`job_locationType_${locationType}`}>{labelContent}</label>
            </div>
        )
    });

    return (
        <div className="relative pb-6 flex flex-col gap-1">
            <span className="text-lg font-medium">Job location type</span>
            {locationInputs}
        </div>
    )
}

export default JobFormLocationType