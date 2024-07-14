import { useEffect, useState } from "react";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type FilterByHoursPerWeekProps = {
    isDesktopLayout?: boolean;
}

const FilterByHoursPerWeek = (props: React.PropsWithoutRef<FilterByHoursPerWeekProps>) => {
    const [isFetch, setIsFetch] = useState(false);

    const queryClient = useQueryClient();

    const customSearchParams = useCustomSearchParams();

    const [URLSearchParams] = useSearchParams();
    const { hours_per_week } = getOnlyValidJobSearchedQueries(URLSearchParams);

    const radioOptions = ["Less", "More"] as const;

    const radioInputs = radioOptions.map(option => {

        const validOptions = {
            "More": "30-168",
            "Less": "1-30"
        };

        const getHoursPerWeekHandler = () => {
            customSearchParams.setSearchParams({
                key: "hours_per_week",
                value: validOptions[option]
            });

            setIsFetch(true);
        }

        const isChecked = hours_per_week && hours_per_week === validOptions[option] ? true : false;

        return (
            <div key={option} className="flex items-center gap-1">
                <input type="radio" name="hoursPerWeek" id={`${props.isDesktopLayout ? "desktop" : "mobile"}_${option}_than_30`} className="appearance-none invisible" onChange={getHoursPerWeekHandler} value={option} checked={isChecked} />
                <label htmlFor={`${props.isDesktopLayout ? "desktop" : "mobile"}_${option}_than_30`} className="flex items-center gap-2">
                    <div className={` flex items-center justify-center w-3 h-3 rounded-full outline outline-2  ${isChecked ? "outline-purple-500 bg-purple-500 outline-offset-2" : "outline-slate-300"}`}></div>
                    {`${option} than 30 hrs/week`}
                </label>
            </div>
        )
    });

    useEffect(() => {
        if (hours_per_week && isFetch) {
            queryClient.removeQueries({ queryKey: ["jobs"] });
        }
    }, [hours_per_week]);

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-black text-xl">Hours Per Week</h4>
            <fieldset className="flex flex-col gap-2">
                {radioInputs}
            </fieldset>
        </div>
    )
}

export default FilterByHoursPerWeek