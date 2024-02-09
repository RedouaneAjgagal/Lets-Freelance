import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";


const CountryFilter = () => {
    const { country } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const [countryValue, setCountryValue] = useState("");

    const onChangeCountryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const country = e.currentTarget.value;
        setCountryValue(country);
    }

    const countryFilterHandler = () => {
        if ((countryValue === "" && !country)) {
            return;
        }

        dispatch(filterSearchedServicesAction.filterByCountry(countryValue.trim()));
    }

    useEffect(() => {
        if (!country && countryValue !== "") {
            setCountryValue("");
        }
    }, [country]);

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Location</h4>
            <div className="flex flex-col gap-2 relative justify-center">
                <input type="text" className="border-2 border-slate-300 rounded py-1 px-3 pr-20 outline-slate-400" placeholder="Search locations" value={countryValue} onChange={onChangeCountryHandler} />
                <button disabled={countryValue === "" && !country} type="button" onClick={countryFilterHandler} className={`${countryValue === "" && !country ? "bg-purple-400" : "bg-purple-600"} absolute h-full rounded-r px-2 text-white right-0`}>Apply</button>
            </div>
        </div>
    )
}

export default CountryFilter