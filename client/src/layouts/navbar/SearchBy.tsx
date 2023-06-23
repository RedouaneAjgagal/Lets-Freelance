import React from 'react'

interface Props {
    searchByHandler: (value: string) => void;
    value: "Talent" | "Projects" | "Jobs";
    currentTarget: string;
}

const SearchBy = (props: React.PropsWithoutRef<Props>) => {

    const searchByhandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        props.searchByHandler(e.currentTarget.value);
    }
    return (
        <button onClick={searchByhandler} value={props.value.toLowerCase()} className={`${props.value.toLowerCase() === props.currentTarget ? "border-b-2 border-indigo-800 text-slate-950" : ""}`}>{props.value}</button>
    )
}

export default SearchBy