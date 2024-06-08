import { useQueryClient } from "@tanstack/react-query";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";


const EventReportsFilterBySorting = () => {
    const queryClient = useQueryClient();

    const sortings = ["newest", "oldest"] as const;

    const customSearchParams = useCustomSearchParams();

    const sortQuery = customSearchParams.getSearchParams({
        key: "sort"
    });

    const sortButtons = sortings.map(sort => {
        const setQuery = () => {
            customSearchParams.setSearchParams({
                key: "sort",
                value: sort
            });

            queryClient.removeQueries({queryKey: ["eventReports"]});
        }

        return (
            <button onClick={setQuery} key={sort} value={sort} className={`capitalize py-1 px-3 rounded font-medium ${(sort === "newest" && (!sortQuery || sortQuery === "newest"))
                ? "bg-slate-800 text-white"
                : (sort === "oldest" && (sortQuery === "oldest"))
                    ? "bg-slate-800 text-white"
                    : ""
                }`}>
                {sort}
            </button>
        )
    })

    return (
        <div className="flex gap-2">
            {sortButtons}
        </div>
    )
}

export default EventReportsFilterBySorting