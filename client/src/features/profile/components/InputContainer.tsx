
interface Props {
    label: string;
    name: string;
    type: "text" | "email" | "number" | "date";
    isError: boolean;
    errorMsg: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    defaultValue?: string;
    withBtn?: boolean;
    onConfirm?: () => void;
    btnContent?: string;
    readonly?: boolean;
    disabled?: boolean;
}

const InputContainer = (props: React.PropsWithoutRef<Props>) => {

    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={props.name} className="font-medium">
                {props.label}
            </label>
            <div className={`relative ${props.withBtn ? "grid grid-cols-3 gap-1 items-center" : ""}`}>
                <input onChange={props.onChange} value={props.value} defaultValue={props.defaultValue} readOnly={props.readonly} disabled={props.readonly} type={props.type} id={props.name} name={props.name} className={`${props.isError ? "border-red-600" : "border-slate-300"} ${props.readonly ? "cursor-not-allowed" : ""} ${props.withBtn ? "col-span-2" : ""} border text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-500 w-full`} />
                {props.withBtn ?
                    <button onClick={props.onConfirm} disabled={props.disabled} type="button" className='col-span-1 bg-slate-500 text-white shadow-sm rounded p-1 h-full'>{props.btnContent}</button>
                    :
                    null
                }
                {props.isError ?
                    <span className="absolute right-0 -bottom-5 text-sm text-red-600">{props.errorMsg}</span>
                    :
                    null
                }
            </div>
        </div>
    )
}

export default InputContainer