import React from 'react'

interface Props {
    onClick: () => void;
}

const UserMenuLink = (props: React.PropsWithChildren<Props>) => {
    return (
        <button onClick={props.onClick} className="px-2 py-3 w-full text-left flex items-center gap-2">
            {props.children}
        </button>
    )
}

export default UserMenuLink