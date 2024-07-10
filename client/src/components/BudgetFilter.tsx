import { useState, useRef, useEffect } from "react";
import convertBudgetToPriceRange from "../utils/covertBudgetToPriceRange";


type BudgetFilterProps = {
    title: string;
    from: number;
    to: number;
    step: number;
    price_range?: string;
    onChange: (range: string) => void;
}

const BudgetFilter = (props: React.PropsWithoutRef<BudgetFilterProps>) => {
    const fromRef = useRef<HTMLInputElement>(null);

    const [from, to] = props.price_range ? props.price_range.split(",") : [];
    const isValidRange = !Number.isNaN(from) && !Number.isNaN(to) && Number(to) >= Number(from);

    const [fromBudget, setFromBudget] = useState(isValidRange ? from : props.from);
    const [toBudget, setToBudget] = useState(isValidRange ? to : props.to);

    const [isFilter, setIsFilter] = useState(false);

    const fromBudgetHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const from = Number(e.currentTarget.value);

        if (!isFilter) {
            setIsFilter(true);
        }

        if (from >= Number(toBudget)) {
            setFromBudget(toBudget);
            fromRef.current?.classList.add("z-20");
            return;
        }
        setFromBudget(from);

    }

    const toBudgetHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const to = Number(e.currentTarget.value);

        if (!isFilter) {
            setIsFilter(true);
        }

        if (to <= Number(fromBudget)) {
            setToBudget(fromBudget);
            fromRef.current?.classList.remove("z-20");
            return;
        }
        setToBudget(to);
    }

    const priceRange = convertBudgetToPriceRange({
        from: Math.floor(Number(fromBudget)),
        to: Math.floor(Number(toBudget))
    });

    useEffect(() => {
        if (isFilter) {
            const filterByPriceRange = setTimeout(() => props.onChange(priceRange), 1500);

            return () => clearTimeout(filterByPriceRange);
        }
    }, [priceRange]);


    useEffect(() => {
        if (!props.price_range) {
            setFromBudget(props.from);
            setToBudget(props.to);
            setIsFilter(false);
        }
    }, [props.price_range]);

    const colors = {
        sliderColor: "#eee",
        rangeColor: "#9333ea"
    }

    const rangeDistance = props.to - props.from;

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl lg:font-semibold">{props.title}</h4>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="px-3 py-1 bg-purple-100/60 rounded text-purple-500">${fromBudget.toLocaleString()}</span>
                    <span className="px-3 py-1 bg-purple-100/60 rounded text-purple-500">
                        {(isFilter || isValidRange) ?
                            `$${toBudget.toLocaleString()}`
                            :
                            `+$${toBudget.toLocaleString()}`
                        }
                    </span>
                </div>
                <div className="relative">
                    <input onChange={fromBudgetHandler} id="fromBudget" name="fromBudget" min={props.from} max={props.to} type="range" className="slider-thumb bg-transparent" value={fromBudget} ref={fromRef!} step={props.step} />
                    <input id="toBudget" name="toBudget" min={props.from} max={props.to} type="range" className="slider-thumb" onChange={toBudgetHandler} value={toBudget} step={props.step} style={{
                        background: `linear-gradient(to right,
                        ${colors.sliderColor} 0%,
                        ${colors.sliderColor} ${100 - Math.abs(((Number(fromBudget) - props.to) / (rangeDistance)) * 100)}%,
                        ${colors.rangeColor} 0%,
                        ${colors.rangeColor} ${100 - Math.abs(((Number(toBudget) - props.to) / rangeDistance) * 100)}%,
                        ${colors.sliderColor} 0%,
                        ${colors.sliderColor} 100%)`
                    }} />
                </div>
            </div>
        </div>
    )
}

export default BudgetFilter