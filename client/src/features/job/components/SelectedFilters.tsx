import { TbX } from "react-icons/tb";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";
import { useSearchParams } from "react-router-dom";
import toUpperCase from "../../../utils/toUpperCase";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useQueryClient } from "@tanstack/react-query";

const SelectedFilters = () => {
    const [URLSearchParams] = useSearchParams();

    const queryClient = useQueryClient();
    const customSearchParams = useCustomSearchParams();

    const searchedQueries = getOnlyValidJobSearchedQueries(URLSearchParams);

    delete searchedQueries.search;
    delete searchedQueries.page;

    const queries = Object.entries(searchedQueries).map(([key, value]) => {
        return { key, value };
    });

    const filters = queries.map(query => {
        let value = query.value;

        if (query.key === "category") {
            let formatCategoryValue: string;
            if (query.value === "digital-marketing") {
                formatCategoryValue = "digital marketing";
            } else {
                formatCategoryValue = value.split("-").join(" & ");
            }

            value = toUpperCase({
                value: formatCategoryValue,
                everyWord: true
            });
        }

        const removeFilterHandler = () => {
            customSearchParams.setSearchParams({
                key: query.key,
                value: ""
            });

            queryClient.removeQueries({ queryKey: ["jobs"] });
        }

        return (
            <button onClick={removeFilterHandler} key={query.key} className="flex items-center gap-2 border-2 border-slate-300 px-2 rounded-full text-purple-600">
                {value}
                <TbX />
            </button>
        )
    });

    return (
        queries.length ?
            <div className="flex items-center gap-2 flex-wrap">
                {filters}
            </div>
            : null
    )
}

export default SelectedFilters