import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";

type EnglishLevelFilterProps = {
    SIZE: number;
}

const EnglishLevelFilter = (props: React.PropsWithoutRef<EnglishLevelFilterProps>) => {
    const { english_level } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const [size, setSize] = useState(props.SIZE);

    const englishLevels = ["Any level", "professional", "native", "fluent", "conversational", "basic"] as const;

    const englishLevelFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const englishLevel = e.currentTarget.value as "Any level" | "professional" | "native" | "fluent" | "conversational" | "basic";

        // check if valid value
        if (!englishLevels.includes(englishLevel)) {
            return;
        }

        dispatch(filterSearchedServicesAction.filterByEnglishLevel(englishLevel));
    }

    const englishLevelsInputs = englishLevels.map((englishLevel, index) => {
        if ((index + 1) > size) {
            return;
        }

        const label = `${englishLevel.slice(0, 1).toUpperCase()}${englishLevel.slice(1).toLowerCase()}`;

        return (
            <label key={label} htmlFor={label} className="flex gap-2">
                <input type="radio" id={label} name="englishLevel" className="accent-purple-600" value={englishLevel} checked={englishLevel === "Any level" ? !english_level : english_level === englishLevel} onChange={englishLevelFilterHandler} />
                {label}
            </label>
        );
    });

    const seeMoreEnglishLevelsHandler = () => {
        setSize(prev => {
            if (prev === englishLevels.length) {
                return props.SIZE;
            } else {
                return englishLevels.length;
            }
        });
    }

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">English Level</h4>
            <div className="flex flex-col gap-2">
                {englishLevelsInputs}
            </div>
            <div>
                <button type="button" onClick={seeMoreEnglishLevelsHandler} className="text-[1rem] text-purple-700">
                    {englishLevels.length > size ?
                        `See ${englishLevels.length - size} more`
                        :
                        "Show less"
                    }
                </button>
            </div>
        </div>
    )
}

export default EnglishLevelFilter