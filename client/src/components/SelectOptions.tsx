import { useState } from "react";
import { TbArrowDown } from "react-icons/tb";
import toUpperCase from "../utils/toUpperCase";


type SelectOptionsProps = {
    selectTitle: string;
    options: { name: string; value: string }[];
    onSelect: ({ name, value }: { name: string; value: string }) => void;
    upperCaseEveryWord?: boolean;
    isError?: boolean;
}

const SelectOptions = (props: React.PropsWithoutRef<SelectOptionsProps>) => {
    const [isSelectOptionsOpen, setIsSelectOptionsOpen] = useState(false);

    const options = props.options.map(option => {
        const optionName = toUpperCase({
            value: option.name,
            everyWord: props.upperCaseEveryWord
        });

        const selectOptionHandler = () => {
            props.onSelect({ name: optionName, value: option.value });
            setIsSelectOptionsOpen(false);
        }

        const isSelected = props.selectTitle.toLowerCase() === option.name.toLowerCase();

        return (
            <button type="button" onClick={selectOptionHandler} key={option.name} value={option.value} className={`w-full flex pl-4 pr-2 py-2 text-slate-800 ${isSelected ? "bg-slate-400 text-white" : ""}`}>{`- ${optionName}`}</button>
        )
    });

    const selectedTitle = toUpperCase({
        value: props.selectTitle,
        everyWord: props.upperCaseEveryWord
    });

    return (
        <div className="w-full relative">
            <button type="button" onClick={() => setIsSelectOptionsOpen(prev => !prev)} className={`bg-white border-2 px-2 py-1 rounded flex items-center gap-1 justify-between w-full ${isSelectOptionsOpen ? "border-slate-400" : `${props.isError ? "border-red-300" : "border-slate-300"}`}`}>
                {selectedTitle}
                <TbArrowDown />
            </button>
            {isSelectOptionsOpen ?
                <div className={`w-full absolute z-10 top-10 left-0 border-2 border-slate-400 rounded bg-slate-50 shadow-lg`}>
                    {options}
                </div>
                : null
            }
        </div>
    )
}

export default SelectOptions