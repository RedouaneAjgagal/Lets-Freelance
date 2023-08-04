import React from 'react'

interface Props {
    onClick: () => void;
    isActive: boolean;
}

const UserMenuLink = (props: React.PropsWithChildren<Props>) => {

    return (
        <button onClick={props.onClick} className={`py-2 px-3 rounded w-full text-left flex items-center gap-2 ${props.isActive ? "bg-slate-500 text-white" : "bg-transparent"}`}>
            {props.children}
        </button>
    )
}

export default UserMenuLink