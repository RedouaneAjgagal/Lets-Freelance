import { useEffect, useState } from "react";
import SelectOptions from "../../../components/SelectOptions"
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";
import { useSearchParams } from "react-router-dom";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useQueryClient } from "@tanstack/react-query";


const FilterByCategory = () => {
    const queryClient = useQueryClient();

    const customSearchParams = useCustomSearchParams();

    const [URLSearchParams] = useSearchParams();
    const { category } = getOnlyValidJobSearchedQueries(URLSearchParams);

    const categories = ["programming & tech", "design & creative", "digital marketing", "writing & translation", "video & animation", "finance & accounting", "music & audio"] as const;

    const options: { name: string; value: string }[] = categories.map(category => {
        if (category === "digital marketing") {
            return { name: category, value: "digital-marketing" }
        } else {
            const value = category.split(" & ").join("-");
            return { name: category, value }
        }
    });

    const getCategory = options.find(option => option.value === category);
    const [selectedCategory, setSelectedCategory] = useState<Partial<{ name: string; value: string }>>(getCategory || {});


    const selectCategoryHandler = ({ name, value }: { name: string; value: string }) => {
        setSelectedCategory({
            name,
            value
        });

        queryClient.removeQueries({ queryKey: ["jobs"] });
    }

    useEffect(() => {
        if (selectedCategory.value) {
            customSearchParams.setSearchParams({
                key: "category",
                value: selectedCategory.value
            });
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (!URLSearchParams.get("category")) {
            setSelectedCategory({});
        }
    }, [URLSearchParams.get("category")]);

    return (
        <div className="flex flex-col gap-3">
            <span className="text-black text-xl">Category</span>
            <SelectOptions selectTitle={selectedCategory.name || "Select categories"} options={options} onSelect={selectCategoryHandler} upperCaseEveryWord />
        </div>
    )
}

export default FilterByCategory