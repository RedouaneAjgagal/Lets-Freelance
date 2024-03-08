import useCustomSearchParams from "../../../hooks/useCustomSearchParams";

const FilterContracts = () => {
    const statusOptions = [
        {
            name: "All",
            value: "all"
        },
        {
            name: "In Progress",
            value: "inProgress"
        },
        {
            name: "Completed",
            value: "completed"
        },
        {
            name: "Canceled",
            value: "canceled"
        }
    ];

    const filterStatus = statusOptions.map(status => {
        const { getSearchParams, setSearchParams } = useCustomSearchParams();

        const statusQuery = getSearchParams({ key: "status" });

        const validStatusTypes = ["inProgress", "completed", "canceled"];

        const getStatus = (statusQuery && validStatusTypes.includes(statusQuery)) ? statusQuery : "all";

        const filterStatusHandler = () => {
            if (status.value === "all") {
                setSearchParams({
                    key: "",
                    value: "",
                    removePrev: true
                });
            } else {
                setSearchParams({
                    key: "status",
                    value: status.value
                });
            }
        }

        return (
            <div key={status.value} className="flex items-center gap-1">
                <input className="sr-only appearance-none invisible" onChange={filterStatusHandler} type="radio" name="contractStatus" id={status.value} checked={status.value === getStatus} />
                <label htmlFor={status.value} className={`border-2 rounded py-1 px-2 min-w-[3rem] text-center text-sm font-medium ${status.value === getStatus ? "text-slate-900 border-slate-500" : "text-slate-600 border-slate-200"}`}>{status.name}</label>
            </div>
        )
    });

    return (
        <div className="flex items-center gap-1 flex-wrap">
            {filterStatus}
        </div>
    )
}

export default FilterContracts