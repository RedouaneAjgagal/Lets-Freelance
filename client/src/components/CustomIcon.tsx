import React from 'react'

interface Props {
    iconSrc: string;
    iconAlt: string;
    iconSize: 6 | 8 | 10 | 12
    highlightPosition: "br" | "bl" | "tr" | "tl"
}

const CustomIcon = (props: React.PropsWithoutRef<Props>) => {
    const iconSize = {
        6: "w-6 h-6 before:w-6 before:h-6",
        8: "w-8 h-8 before:w-8 before:h-8",
        10: "w-10 h-10 before:w-10 before:h-10",
        12: "w-12 h-12 before:w-12 before:h-12",
    }

    const highlightPosition = {
        "br": "before:top-4 before:left-4",
        "bl": "before:top-4 before:-left-4",
        "tr": "before:-top-4 before:left-4",
        "tl": "before:-top-4 before:-left-4"
    }

    return (
        <div className={`relative before:bg-purple-100/60 before:absolute before:rounded-full before:-z-10 ${iconSize[props.iconSize]} ${highlightPosition[props.highlightPosition]}`}>
            <img src={props.iconSrc} alt={props.iconAlt} className='object-cover w-full h-full' />
        </div>
    )
}

export default CustomIcon