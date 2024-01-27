type SelectServiceTierInputProps = {
    setTier: (tier: "starter" | "standard" | "advanced") => void;
    tier: "starter" | "standard" | "advanced";
    selectedTier: "starter" | "standard" | "advanced";
    price: number;
}

const SelectServiceTierInput = (props: React.PropsWithoutRef<SelectServiceTierInputProps>) => {
    const fieldSetChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTier(e.currentTarget.value as "starter" | "standard" | "advanced");
    }

    const isChecked = props.selectedTier === props.tier;

    return (
        <label htmlFor={props.tier} className="flex flex-col items-center">
            <input type="radio" name="tier" id={props.tier} value={props.tier} onChange={fieldSetChangeHandler} checked={isChecked} className="accent-purple-600" />
            <span className={`${isChecked ? "font-medium" : "text-slate-700"}`}>Starter</span>
            <span className={`${isChecked ? "font-medium" : "text-slate-700"}`}> ${props.price.toFixed(0)}</span>
        </label>
    )
}

export default SelectServiceTierInput