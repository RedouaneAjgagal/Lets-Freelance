import { useQueryClient } from "@tanstack/react-query";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useSearchParams } from "react-router-dom";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";

type FilterByProjectType = {
    isDesktopLayout?: boolean;
}

const FilterByProjectType = (props: React.PropsWithoutRef<FilterByProjectType>) => {
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
        const isChecked = project_type && project_type === jobType.toLowerCase() || false;

        return (
            <div key={jobType} className="flex items-center gap-1">
                <input onChange={getJobTypeHanlder} type="radio" name="jobType" id={`${props.isDesktopLayout ? "desktop" : "mobile"}_${jobType.toLowerCase()}`} className="appearance-none" value={jobType} checked={isChecked} />
                <label className="flex items-center gap-2" htmlFor={`${props.isDesktopLayout ? "desktop" : "mobile"}_${jobType.toLowerCase()}`} >
                    <div className={` flex items-center justify-center w-3 h-3 rounded-full outline outline-2  ${isChecked ? "outline-purple-500 bg-purple-500 outline-offset-2" : "outline-slate-300"}`}></div>
                    {jobType}
                </label>
            </div>
        )
    });

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-black text-xl">Job Type</h4>
            <fieldset className="flex items-center gap-6 flex-wrap">
                {jobTypesInputs}
            </fieldset>
        </div>
    )
}

export default FilterByProjectType