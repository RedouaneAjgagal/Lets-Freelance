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

    if (searchedQueries.project_price) {
        const [min, max] = searchedQueries.project_price!.split("-");
        if ((+min > +max) || (+min === 0 && +max === 0)) {
            delete searchedQueries.project_price;
        }
    }

    const queries = Object.entries(searchedQueries).map(([key, value]) => {
        return { key, value };
    });

    const filters = queries.map(query => {
        let value = query.value;

        if (query.key === "category") {
            if (query.value === "digital-marketing") {
                value = "digital marketing";
            } else {
                value = value.split("-").join(" & ");
            }
        } else if (query.key === "project_price") {
            value = value.split("-").map(number => `$${number}`).join(" - ");
        }

        value = toUpperCase({
            value,
            everyWord: true
        });

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