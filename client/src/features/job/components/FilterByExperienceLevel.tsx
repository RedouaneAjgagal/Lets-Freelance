import { useSearchParams } from "react-router-dom"
import SelectOptions from "../../../components/SelectOptions"
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries"
import useCustomSearchParams from "../../../hooks/useCustomSearchParams"
import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"


const FilterByExperienceLevel = () => {
    const queryClient = useQueryClient();

    const [isFetch, setIsFetch] = useState(false);

    const customSearchParams = useCustomSearchParams();

    const [URLSearchParams] = useSearchParams();
    const { experience_level } = getOnlyValidJobSearchedQueries(URLSearchParams);

    const experienceLevelOptions = [
        {
            name: "Entry Level",
            value: "entry-level"
        },
        {
            name: "Intermediate",
            value: "intermediate"
        },
        {
            name: "Expert",
            value: "expert"
        }
    ];

    const selectExperienceLevelHandler = ({ value }: { name: string; value: string }) => {
        customSearchParams.setSearchParams({
            key: "experience_level",
            value
        });

        setIsFetch(true);
    }

    const selectTitle = experience_level ?
        experience_level.split("-").join(" ")
        : "Select Experience Level"


    useEffect(() => {
        if (experience_level && isFetch) {
            queryClient.removeQueries({ queryKey: ["jobs"] });
        }
    }, [experience_level]);

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Experience Level</h4>
            <SelectOptions selectTitle={selectTitle} onSelect={selectExperienceLevelHandler} options={experienceLevelOptions} upperCaseEveryWord />
        </div>
    )
}

export default FilterByExperienceLevel