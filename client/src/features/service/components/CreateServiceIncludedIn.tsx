import { BsArrowDown, BsCheck, BsX } from 'react-icons/bs';
import { ServiceIncludedInTier, ServiceTiersTypes, createServiceAction } from '../redux/createService';
import { useState } from 'react';
import { TbTrash } from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';

type CreateServiceIncludedInProps = {
    includedIn: ServiceIncludedInTier;
    onRemoveIncludedIn: (includedInId: string) => void;
    tierName: keyof ServiceTiersTypes;
}

const CreateServiceIncludedIn = (props: React.PropsWithoutRef<CreateServiceIncludedInProps>) => {
    const { tier } = useAppSelector(state => state.createServiceReducer);
    const dispatch = useAppDispatch();
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const [numberResult, setNumberResult] = useState("");

    const toggleSelectHandler = () => {
        setIsSelectOpen(prev => !prev);
    }

    const removeIncludedInHandler = () => {
        props.onRemoveIncludedIn(props.includedIn.id);
    }

    const setDescriptionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(createServiceAction.setIncludedIn({
            type: "description",
            id: props.includedIn.id,
            tier: props.tierName,
            value: e.currentTarget.value
        }));
    }

    const onChangeNumberResult = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumberResult(e.currentTarget.value);
    }

    const setResultHandler = (value: string) => {
        dispatch(createServiceAction.setIncludedIn({
            type: "result",
            id: props.includedIn.id,
            tier: props.tierName,
            value
        }));

        toggleSelectHandler();
    }

    const setResultHandlerOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setResultHandler(numberResult);
        }
    }

    const error = tier[props.tierName].includedIn.value.find(includedIn => includedIn.id === props.includedIn.id);

    const selected: { [key: string]: React.JSX.Element } = {
        "true": <BsCheck size={24} className="text-green-700" />,
        "false": <BsX size={24} className="text-red-700" />
    };

    return (
        <div className="flex gap-2">
            <button onClick={removeIncludedInHandler} className="text-red-600 self-center py-1">
                <TbTrash size={20} />
            </button>
            <div className="col-span-2 flex items-center gap-1 w-full">
                <div className="relative pb-6 flex flex-col gap-1 w-full">
                    <label htmlFor={`${props.includedIn.id}_description`} className="font-medium">
                        Description
                    </label>
                    <input onChange={setDescriptionHandler} id={`${props.includedIn.id}_description`} type="text" className={`${error?.description.error.msg ? "border-red-300" : "border-slate-300"} w-full border-2 rounded outline-slate-400 px-2 py-1 placeholder:text-sm`} min={1} placeholder="Number of Revisions" value={props.includedIn.description.value} />
                </div>
            </div>
            <div className="relative pb-6 flex flex-col gap-1 col-span-1">
                <span className="font-medium">
                    Select
                </span>
                <button onClick={toggleSelectHandler} className={`${error?.result.error.msg ? "border-red-300" : "border-slate-300"} flex justify-between items-center border-2 gap-1 h-full rounded px-2 text-slate-700`}>
                    <span>{selected[props.includedIn.result.value.toString()] || props.includedIn.result.value.toString()}</span>
                    <BsArrowDown size={20} className={`${isSelectOpen ? "-rotate-180" : "-rotate-0"} transition-all duration-300`} />
                </button>
                {isSelectOpen ?
                    <div className="absolute z-10 right-0 -bottom-[7.3rem] bg-slate-50 border-2 rounded border-slate-300 min-w-[14rem] p-3 flex flex-col gap-2">
                        <div className="flex gap-2 justify-center font-normal">
                            <button className="w-full bg-green-100 font-medium border border-green-200 rounded py-1 flex justify-center items-center" onClick={() => setResultHandler("true")} >
                                {selected.true}
                            </button>
                            <button className="w-full bg-red-100 border border-red-200 font-medium rounded py-1 flex justify-center items-center" onClick={() => setResultHandler("false")}>
                                {selected.false}
                            </button>
                        </div>
                        <p className="flex justify-center text-sm text-slate-400 font-medium">--------------- Or ---------------</p>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <input id={`${props.includedIn.id}_select`} type="number" className="w-full border-2 rounded outline-slate-400 px-2 py-1 border-slate-300 placeholder:text-sm" min={1} placeholder="Number" value={numberResult} onChange={onChangeNumberResult} onKeyDown={setResultHandlerOnKeyDown} />
                                <button onClick={() => setResultHandler(numberResult)} className="bg-white border-2 border-slate-300 p-[.35rem] rounded text-green-600">
                                    <BsCheck size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

export default CreateServiceIncludedIn;