import { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";
import convertBudgetToPriceRange from "../../../utils/covertBudgetToPriceRange";

type BudgetFilterProps = {
    from: number;
    to: number;
    step: number;
}

const BudgetFilter = (props: React.PropsWithoutRef<BudgetFilterProps>) => {
    const dispatch = useAppDispatch();
    const fromRef = useRef<HTMLInputElement>(null);

    const [fromBudget, setFromBudget] = useState(props.from);
    const [toBudget, setToBudget] = useState(props.to);


    const [isFilter, setIsFilter] = useState(false);

    const fromBudgetHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const from = Number(e.currentTarget.value);

        if (!isFilter) {
            setIsFilter(true);
        }

        if (from >= toBudget) {
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

        if (to <= fromBudget) {
            setToBudget(fromBudget);
            fromRef.current?.classList.remove("z-20");
            return;
        }
        setToBudget(to);
    }

    const priceRange = convertBudgetToPriceRange({
        from: Math.floor(fromBudget),
        to: Math.floor(toBudget)
    });

    useEffect(() => {
        if (isFilter) {
            const filterByPriceRange = setTimeout(() => {
                dispatch(filterSearchedServicesAction.filterByPriceRange(priceRange));
            }, 1500);

            return () => clearTimeout(filterByPriceRange);
        }
    }, [priceRange]);

    const colors = {
        sliderColor: "#eee",
        rangeColor: "#9333ea"
    }

    const rangeDistance = props.to - props.from;

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Budget</h4>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="px-3 py-1 bg-purple-100/60 rounded text-purple-500">${fromBudget}</span>
                    <span className="px-3 py-1 bg-purple-100/60 rounded text-purple-500">
                        {isFilter ?
                            `$${toBudget}`
                            :
                            `+$${toBudget}`
                        }
                    </span>
                </div>
                <div className="relative">
                    <input onChange={fromBudgetHandler} id="fromBudget" name="fromBudget" min={props.from} max={props.to} type="range" className="slider-thumb bg-transparent" value={fromBudget} ref={fromRef!} step={props.step} />
                    <input id="toBudget" name="toBudget" min={props.from} max={props.to} type="range" className="slider-thumb" onChange={toBudgetHandler} value={toBudget} step={props.step} style={{
                        background: `linear-gradient(to right,
                        ${colors.sliderColor} 0%,
                        ${colors.sliderColor} ${100 - Math.abs(((fromBudget - props.to) / (rangeDistance)) * 100)}%,
                        ${colors.rangeColor} 0%,
                        ${colors.rangeColor} ${100 - Math.abs(((toBudget - props.to) / rangeDistance) * 100)}%,
                        ${colors.sliderColor} 0%,
                        ${colors.sliderColor} 100%)`
                    }} />
                </div>
            </div>
        </div>
    )
}

export default BudgetFilter