import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useSearchParams } from "react-router-dom";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";

type FilterByLocationTypeProps = {
    isDesktopLayout?: boolean;
}

const FilterByLocationType = (props: React.PropsWithoutRef<FilterByLocationTypeProps>) => {
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

        const isChecked = location_type && location_type === option.toLowerCase() ? true : false;

        return (
            <div key={option} className="flex items-center gap-1">
                <input type="radio" name="projectLocation" id={`${props.isDesktopLayout ? "desktop" : "mobile"}_${option.toLowerCase()}`} className="appearance-none invisible" onChange={getProjectLocationHandler} value={option} checked={isChecked} />
                <label htmlFor={`${props.isDesktopLayout ? "desktop" : "mobile"}_${option.toLowerCase()}`} className="flex items-center gap-2">
                    <div className={` flex items-center justify-center w-3 h-3 rounded-full outline outline-2  ${isChecked ? "outline-purple-500 bg-purple-500 outline-offset-2" : "outline-slate-300"}`}></div>
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
        <div className="flex flex-col gap-2">
            <h4 className="text-black text-xl">Project Location</h4>
            <fieldset className="flex flex-col gap-2">
                {radioInputs}
            </fieldset>
        </div>
    )
}

export default FilterByLocationType