
type ToggleProps = {
    id: string;
    onChange: () => void;
    isChecked: boolean;
    isLoading: boolean;
}

const Toggle = (props: React.PropsWithoutRef<ToggleProps>) => {
    return (
        <div className="flex">
            <label htmlFor={props.id}>
                <span className={`border-2 rounded-full ${props.isLoading ? "border-slate-400" : "border-slate-500"} w-10 h-5 self-center flex items-center relative ${props.isChecked ? props.isLoading ? "bg-slate-400" : "bg-slate-500" : ""}`}>
                    <span className={`w-3 h-3 rounded-full absolute transition-all ${props.isChecked ? "translate-x-5 bg-white" : `translate-x-1 ${props.isLoading ? "bg-slate-400" : "bg-slate-500"}`}`}></span>
                </span>
            </label>
            <input onChange={props.onChange} type="checkbox" className="appearance-none" id={props.id} defaultChecked={props.isChecked} />
        </div>
    )
}

export default Toggle