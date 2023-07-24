interface Props {
    name: string;
    label: string;
    defaultValue?: string;
    value?: string;
    options: string[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInputContainer = (props: React.PropsWithoutRef<Props>) => {
    const value = `${props.value?.slice(0,1).toUpperCase()}${props.value?.slice(1).toLowerCase()}`
    
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={props.name} className="font-medium">{props.label}</label>
            <select onChange={props.onChange} name={props.name} id={props.name} className="border-slate-300 border text-slate-600 rounded py-2 px-1 outline-none focus:border-slate-500 w-full" value={value} defaultValue={props.defaultValue}>
                {props.options.map((option, index) => <option key={index}>{option}</option>)}
            </select>
        </div>
    )
}

export default SelectInputContainer