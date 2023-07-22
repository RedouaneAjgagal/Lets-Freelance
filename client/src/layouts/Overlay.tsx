import React from 'react'

interface Props {
    onClose: () => void;
}

const Overlay = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className="fixed w-full h-full top-0 left-0 bg-slate-900/90 z-40" onClick={props.onClose} role="button"></div>
    )
}

export default Overlay