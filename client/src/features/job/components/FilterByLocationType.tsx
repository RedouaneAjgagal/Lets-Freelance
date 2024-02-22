import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useSearchParams } from "react-router-dom";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";

const FilterByLocationType = () => {
    const [isFetch, setIsFetch] = useState(false);

    const queryClient = useQueryClient();

    const customSearchParams = useCustomSearchParams();

    const [URLSearchParams] = useSearchParams();

    const { location_type } = getOnlyValidJobSearchedQueries(URLSearchParams);

    const locationTypeOptions = ["Remote", "Onsite"] as const;

    const radioInputs = locationTypeOptions.map(option => {
        const getProjectLocationHandler = () => {
            customSearchParams.setSearchParams({
                key: "location_type",
                value: option.toLowerCase()
            });

            setIsFetch(true);
        }

        return (
            <div key={option} className="flex items-center gap-1">
                <input type="radio" name="projectLocation" id={option.toLowerCase()} className="accent-purple-600" onChange={getProjectLocationHandler} value={option} checked={location_type && location_type === option.toLowerCase() ? true : false} />
                <label htmlFor={option.toLowerCase()}>
                    {option}
                </label>
            </div>
        )
    });

    useEffect(() => {
        if (location_type && isFetch) {
            queryClient.removeQueries({ queryKey: ["jobs"] });
        }
    }, [location_type]);

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Project Location</h4>
            <fieldset className="flex flex-col gap-2">
                {radioInputs}
            </fieldset>
        </div>
    )
}

export default FilterByLocationType