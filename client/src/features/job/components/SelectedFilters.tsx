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

        switch (query.key) {
            case "category":
                if (query.value === "digital-marketing") {
                    value = "digital marketing";
                } else {
                    value = value.split("-").join(" & ");
                }
                break;

            case "project_price":
                value = value.split("-").map(number => `$${number}`).join(" - ");
                break;

            case "project_length":
                const comparison = value.includes(">") ? ">" : "<";
                const [duration, projectLengthValue] = value.split(comparison);
                const projectLengthValuePluralize = Number(projectLengthValue) === 1 ? "" : "s";

                value = `${comparison === "<" ? "Less" : "More"} than ${projectLengthValue} ${duration.slice(0, -1)}${projectLengthValuePluralize}`;

                break;

            case "hours_per_week":
                if (value === "1-30") {
                    value = "Less than 30 hrs/week";
                } else if (value === "30-168") {
                    value = "More than 30 hrs/week";
                } else {
                    const [min_hoursPerWeek, max_hoursPerWeek] = value.split("-");
                    value = `Between ${min_hoursPerWeek} & ${max_hoursPerWeek} hrs/week`;
                }
                break;

            default:
                break;
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