interface Props {
    name: string;
    label: string;
    defaultValue: string;
    options: string[];
}

const SelectInputContainer = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={props.name} className="font-medium">{props.label}</label>
            <select name={props.name} id={props.name} className="border-slate-300 border text-slate-600 rounded py-2 px-1 outline-none focus:border-slate-500 w-full" defaultValue={props.defaultValue}>
                {props.options.map((option, index) => <option key={index}>{option}</option>)}
            </select>
        </div>
    )
}

export default SelectInputContainer