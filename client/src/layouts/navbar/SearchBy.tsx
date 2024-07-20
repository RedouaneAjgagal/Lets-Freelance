import React from 'react'

interface Props {
    searchByHandler: (value: "talent" | "services" | "jobs") => void;
    value: "Talent" | "Services" | "Jobs";
    currentTarget: string;
    closeDropdownHandler: () => void;
}

const SearchBy = (props: React.PropsWithoutRef<Props>) => {

    const searchByhandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        props.searchByHandler(e.currentTarget.value as "talent" | "services" | "jobs");
        props.closeDropdownHandler();
    }
    return (
        <button onClick={searchByhandler} value={props.value.toLowerCase()} className={`${props.value.toLowerCase() === props.currentTarget ? "border-b-2 border-slate-800 text-slate-950 xl:border-b-0 xl:bg-slate-100" : "xl:font-normal xl:text-slate-600"} xl:w-full xl:text-left xl:px-3 xl:py-2`}>{props.value}</button>
    )
}

export default SearchBy