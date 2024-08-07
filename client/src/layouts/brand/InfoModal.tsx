import React from 'react'

type InfoModalProps = {
    content: string;
    position: "left" | "center" | "right";
    width: "sm" | "md" | "lg";
    mobileLayoutAuto?: boolean;
}

const InfoModal = (props: React.PropsWithoutRef<InfoModalProps>) => {

    const positions = {
        left: `${props.mobileLayoutAuto ? "left-0 lg:right-0" : "right-0"}`,
        center: `${props.mobileLayoutAuto ? "left-0 translate-x-0 lg:left-1/2 lg:-translate-x-1/2" : "left-1/2 -translate-x-1/2"}`,
        right: `${props.mobileLayoutAuto ? "left-0 lg:left-0" : "left-0"}`
    };

    const position = positions[props.position];

    const widthTypes = {
        sm: "w-44",
        md: "w-56",
        lg: "w-64"
    }

    const width = widthTypes[props.width];

    return (
        <div className={`group-hover:grid hidden gap-2 text-sm text-slate-700 absolute bottom-6 bg-white border-2 shadow-lg rounded text-center p-2 z-10 ${position} ${width}`}>
            <p>{props.content}</p>
        </div>
    )
}

export default InfoModal