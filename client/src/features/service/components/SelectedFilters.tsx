import { TbX, TbStarFilled } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { FilterSearchedServicesInitialState, filterSearchedServicesAction } from "../redux/filterSearchedServices";

const SelectedFilters = () => {
    const filterServicesQueries = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const removeFilterHanlder = (key: string) => {
        dispatch(filterSearchedServicesAction.removeQuery(key as keyof FilterSearchedServicesInitialState));
    }

    const filters = Object.entries(filterServicesQueries).map(([key, value]) => {
        if (key === "search") return;

        let formatedValue: string | number | React.JSX.Element = "";

        switch (key) {
            case "category":
                if (value === "digital-marketing") {
                    formatedValue = "Digital Marketing"
                } else {
                    formatedValue = value.toString()
                        .split("-")
                        .map(word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLocaleLowerCase()}`)
                        .join(" & ");
                }
                break;

            case "delivery_time":
                const deliveryTimes: {
                    [key: number]: string;
                } = {
                    1: "Extra fast 24 hour delivery",
                    3: "Three days delivery",
                    7: "One week delivery",
                    21: "Three weeks delivery"
                }

                formatedValue = deliveryTimes[Number(value)];
                break;

            case "price_range":
                const budget = value.toString().split(",");
                if (Number(budget[0]) === Number(budget[1])) {
                    formatedValue = `$${budget[1]}`;
                } else {
                    formatedValue = budget.map(price => `$${price}`).join(" - ");
                }
                break;

            case "rating":
                formatedValue = <>
                    <TbStarFilled size={12} className="text-slate-400" />
                    {value} & up
                </>
                break;

            case "badge":
                formatedValue = value.toString()
                    .split("-")
                    .map(word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLocaleLowerCase()}`)
                    .join(" ")
                break;

            default:
                formatedValue = `${value.toString().slice(0, 1).toUpperCase()}${value.toString().slice(1).toLocaleLowerCase()}`
                break;
        }

        return (
            <button key={key} className="border rounded-full px-2 text-[0.8rem] border-slate-500 text-slate-700 flex items-center gap-1" onClick={() => removeFilterHanlder(key)}>
                {formatedValue}
                <TbX size={18} className="text-slate-500" />
            </button>
        )
    });

    const clearAllFiltersHandler = () => {
        dispatch(filterSearchedServicesAction.clearAll({ keepSearch: true }));
    }

    return (
        <div className="flex items-start justify-between gap-1">
            <div className="flex items-center gap-2 flex-wrap">
                {filters}
            </div>
            <div className="max-w-[5rem] w-full">
                <button className="text-red-600 font-medium text-sm py-1 w-full" onClick={clearAllFiltersHandler}>Clear all</button>
            </div>
        </div>
    )
}

export default SelectedFilters