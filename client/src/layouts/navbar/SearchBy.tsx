import React from 'react'

interface Props {
    searchByHandler: (value: "talent" | "services" | "jobs") => void;
    value: "Talent" | "Services" | "Jobs";
    currentTarget: string;
}

const SearchBy = (props: React.PropsWithoutRef<Props>) => {

    const searchByhandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        props.searchByHandler(e.currentTarget.value as "talent" | "services" | "jobs");
    }
    return (
        <button onClick={searchByhandler} value={props.value.toLowerCase()} className={`${props.value.toLowerCase() === props.currentTarget ? "border-b-2 border-slate-800 text-slate-950" : ""}`}>{props.value}</button>
    )
}

export default SearchBy