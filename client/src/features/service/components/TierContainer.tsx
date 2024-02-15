import { BsArrowDown, BsPlus } from "react-icons/bs"
import InputContainer from "./InputContainer"
import { ServiceTier, ServiceIncludedInTier, ServiceTiersTypes, createServiceAction } from "../redux/createService";
import CreateServiceIncludedIn from "./CreateServiceIncludedIn";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

type TierContainerProps = {
    tierName: keyof ServiceTiersTypes;
    deliveryTime: ServiceTier["deliveryTime"];
    price: ServiceTier["price"];
    includedIn: ServiceIncludedInTier[];
    onToggle: (tierName: keyof ServiceTiersTypes) => void;
    isTierOpen: boolean;
    isError: boolean;
}

const TierContainer = (props: React.PropsWithoutRef<TierContainerProps>) => {
    const { tier } = useAppSelector(state => state.createServiceReducer);
    const dispatch = useAppDispatch();

    const openTierHandler = () => {
        props.onToggle(props.tierName);
    }

    const uniqueId = `${crypto.randomUUID()}_${props.tierName}`;


    const addMoreInludedInHandler = () => {
        dispatch(createServiceAction.includedInAcions({
            type: "add",
            tier: props.tierName
        }));
    }

    const removeIncludedInHandler = (id: string) => {
        dispatch(createServiceAction.includedInAcions({
            type: "remove",
            tier: props.tierName,
            id
        }));
    }

    const deliveryTimeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(createServiceAction.setGeneralTierInfo({
            type: "deliveryTime",
            tier: props.tierName,
            value: e.currentTarget.value
        }));
    }

    const priceChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(createServiceAction.setGeneralTierInfo({
            type: "price",
            tier: props.tierName,
            value: e.currentTarget.value
        }));
    }

    const copyIncludedInHandler = () => {
        dispatch(createServiceAction.duplicateIncludedIn({
            tierName: props.tierName
        }))
    }

    return (
        <div className="flex flex-col bg-white">
            <button onClick={openTierHandler} className={`${props.isTierOpen ? "rounded-t" : "rounded"} ${props.isError && !props.isTierOpen ? "border-red-300" : "border-slate-300"} flex items-center justify-between w-full border-2 px-2 py-3 font-semibold text-purple-700 text-lg tracking-wide`}>
                {props.tierName.toUpperCase()}
                <BsArrowDown className={`${props.isTierOpen ? "-rotate-180" : "-rotate-0"} transition-all duration-300`} />
            </button>
            {props.isTierOpen ?
                <div className="border-2 border-t-0 rounded-b border-slate-300 p-3">
                    <InputContainer label="Delivery Time (Day)" id={`${uniqueId}_deliveryTime`} error={props.deliveryTime.error.msg}>
                        <input onChange={deliveryTimeChangeHandler} id={`${uniqueId}_deliveryTime`} type="text" className={`border-2 rounded outline-slate-400 px-2 py-1  ${props.deliveryTime.error.msg ? "border-red-300" : "border-slate-300"}`} value={props.deliveryTime.value || ""} />
                    </InputContainer>
                    <InputContainer label="Price ($)" id={`${uniqueId}_price`} error={props.price.error.msg}>
                        <input onChange={priceChangeHandler} id={`${uniqueId}_price`} type="text" className={`border-2 rounded outline-slate-400 px-2 py-1 ${props.price.error.msg ? "border-red-300" : "border-slate-300"}`} min={1} value={props.price.value || ""} />
                    </InputContainer>
                    <div className="relative pb-6 flex flex-col gap-2">
                        <span className={`text-lg font-medium ${props.includedIn.length ? "border-b pb-1 mb-2" : ""}`}>
                            Included In
                        </span>
                        {props.includedIn.length ?
                            <div>
                                {props.includedIn.map(includedIn => <CreateServiceIncludedIn key={includedIn.id} includedIn={includedIn} onRemoveIncludedIn={removeIncludedInHandler} tierName={props.tierName} />)}
                            </div>
                            : null
                        }
                        {props.tierName !== "starter" && !tier[props.tierName].includedIn.value.length && tier[props.tierName === "standard" ? "starter" : "standard"].includedIn.value.length ?
                            <button onClick={copyIncludedInHandler} className="self-end text-sm p-1 underline text-purple-500">Copy the previous</button>
                            : null
                        }
                        <button onClick={addMoreInludedInHandler} className="bg-purple-200/30 border-purple-300 p-2 rounded border flex justify-center items-center text-slate-900">
                            <BsPlus size={24} />
                        </button>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default TierContainer