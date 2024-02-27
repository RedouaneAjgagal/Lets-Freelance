type InputProps = {
    isError: boolean;
    errorMsg: string;
    placeHolder?: string;
    name: React.InputHTMLAttributes<HTMLInputElement>["name"];
    type: React.InputHTMLAttributes<HTMLInputElement>["type"];
    id: React.InputHTMLAttributes<HTMLInputElement>["id"];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    value?: string;
    defaultValue?: string;
}

type InputWithLabelProps = {
    includeLabel: true;
    labelContent: string;
} & InputProps;

type InputWithoutLabelProps = {
    includeLabel: false;
} & InputProps;

const Input = (props: React.PropsWithoutRef<InputWithLabelProps | InputWithoutLabelProps>) => {
    return (
        <div className="relative pb-6 flex flex-col gap-1 w-full">
            {props.includeLabel ?
                <label htmlFor={props.id} className="text-lg font-medium">{props.labelContent}</label>
                : null
            }
            <input onChange={props.onChange} onKeyDown={props.onKeyDown} value={props.value} defaultValue={props.defaultValue} name={props.name} type={props.type} id={props.id} placeholder={props.placeHolder} className={`border-2 w-full rounded bg-white outline-slate-400 px-2 py-1 ${props.isError ? "border-red-300 outline-red-300" : "border-slate-300"}`} />
            {props.isError ?
                <span className="absolute right-0 bottom-1 text-red-600 text-sm">{props.errorMsg}</span>
                : null
            }
        </div>
    )
}

export default Input