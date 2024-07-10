import React from 'react'

type InputContainerProps = {
    error: string;
    id: string;
    label: string;
    isErrorLeftSide?: boolean;
}

const InputContainer = (props: React.PropsWithChildren<InputContainerProps>) => {
    return (
        <div className="relative pb-6">
            <label htmlFor={props.id} className="text-lg font-medium flex flex-col gap-1">
                {props.label}
                {props.children}
            </label>
            {props.error ?
                <span className={`absolute bottom-0 text-red-600 text-sm ${props.isErrorLeftSide ? "left-0" : "right-0"}`}>{props.error}</span>
                : null
            }
        </div>
    )
}

export default InputContainer