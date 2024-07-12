type SelectServiceTierInputProps = {
    setTier: (tier: "starter" | "standard" | "advanced") => void;
    tier: "starter" | "standard" | "advanced";
    selectedTier: "starter" | "standard" | "advanced";
    price: number;
}

const SelectServiceTierInput = (props: React.PropsWithoutRef<SelectServiceTierInputProps>) => {
    const fieldSetChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);

        props.setTier(e.target.value as "starter" | "standard" | "advanced");
    }

    const isChecked = props.selectedTier === props.tier;

    return (
        <label htmlFor={props.tier} className="group cursor-pointer flex flex-col items-center sm:text-lg">
            <div className={`transition-all flex items-center justify-center w-6 h-6 rounded-full border-2  ${isChecked ? "border-purple-500 bg-purple-500" : "border-slate-300 bg-white group-hover:border-slate-400"}`}>
                <span className={`transition-all border border-white rounded-full w-4/5 h-4/5 ${isChecked ? "group-hover:w-1/2 group-hover:h-1/2" : ""}`}></span>
            </div>
            <input type="radio" name="tier" id={props.tier} value={props.tier} onChange={fieldSetChangeHandler} checked={isChecked} className="appearance-none" />
            <span className={`capitalize ${isChecked ? "font-medium" : "text-slate-700"}`}>{props.tier}</span>
            <span className={`${isChecked ? "font-medium" : "text-slate-700"}`}> ${props.price.toFixed(0)}</span>
        </label >
    )
}

export default SelectServiceTierInput