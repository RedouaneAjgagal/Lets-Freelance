import { useEffect, useState } from "react"

type CountryFilterProps = {
    onApplyCountry: (country: string) => void;
    country?: string;
}

const CountryFilter = (props: React.PropsWithoutRef<CountryFilterProps>) => {
    const [countryValue, setCountryValue] = useState(props.country || "");

    const onChangeCountryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const country = e.currentTarget.value;
        setCountryValue(country);
    }

    const countryFilterHandler = () => {
        if ((countryValue === "" && !props.country)) {
            return;
        }

        props.onApplyCountry(countryValue.trim());
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        countryFilterHandler();
    }

    useEffect(() => {
        if (!props.country && countryValue !== "") {
            setCountryValue("");
        }
    }, [props.country]);

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl lg:font-semibold">Location</h4>
            <div className="flex flex-col gap-2 relative justify-center">
                <input type="text" className="border-2 border-slate-300 rounded py-1 px-3 pr-20 outline-slate-400" placeholder="Search locations" value={countryValue} onChange={onChangeCountryHandler} onKeyDown={onKeyDownHandler} />
                <button disabled={countryValue === "" && !props.country} type="button" onClick={countryFilterHandler} className={`${countryValue === "" && !props.country ? "bg-purple-400" : "bg-purple-600"} absolute h-full rounded-r px-2 text-white right-0`}>Apply</button>
            </div>
        </div>
    )
}

export default CountryFilter