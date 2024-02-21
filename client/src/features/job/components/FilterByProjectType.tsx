import { useQueryClient } from "@tanstack/react-query";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useSearchParams } from "react-router-dom";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";


const FilterByProjectType = () => {
    const queryClient = useQueryClient();

    const [URLSearchParams] = useSearchParams();

    const { project_type } = getOnlyValidJobSearchedQueries(URLSearchParams);

    const jobTypes = ["Hourly", "Fixed"];

    const customSearchParams = useCustomSearchParams();

    const getJobTypeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
        const jobType = e.currentTarget.value;

        if (!jobTypes.includes(jobType)) {
            return;
        }

        customSearchParams.setSearchParams({
            key: "project_type",
            value: jobType.toLowerCase()
        });

        queryClient.removeQueries({ queryKey: ["jobs"] });
    }

    const jobTypesInputs = jobTypes.map(jobType => {
        return (
            <div key={jobType} className="flex items-center gap-1">
                <input onChange={getJobTypeHanlder} type="radio" name="jobType" id={jobType.toLowerCase()} className="accent-purple-600" value={jobType} checked={project_type && project_type === jobType.toLowerCase() || false} />
                <label htmlFor={jobType.toLowerCase()} >
                    {jobType}
                </label>
            </div>
        )
    });

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Job Type</h4>
            <fieldset className="flex items-center gap-6 flex-wrap">
                {jobTypesInputs}
            </fieldset>
        </div>
    )
}

export default FilterByProjectType