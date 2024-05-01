import { useState } from "react";

type EnglishLevelType = "Any level" | "professional" | "native" | "fluent" | "conversational" | "basic";

type EnglishLevelFilterProps = {
    SIZE: number;
    onSelectEnglishLevel: (englishLevel: EnglishLevelType) => void;
    englishLevel?: EnglishLevelType;
}

const EnglishLevelFilter = (props: React.PropsWithoutRef<EnglishLevelFilterProps>) => {
    const [size, setSize] = useState(props.SIZE);

    const englishLevels = ["Any level", "professional", "native", "fluent", "conversational", "basic"] as const;

    const englishLevelFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const englishLevel = e.currentTarget.value as EnglishLevelType;

        // check if valid value
        if (!englishLevels.includes(englishLevel)) {
            return;
        }

        props.onSelectEnglishLevel(englishLevel);
    }

    const englishLevelsInputs = englishLevels.map((englishLevel, index) => {
        if ((index + 1) > size) {
            return;
        }

        const label = `${englishLevel.slice(0, 1).toUpperCase()}${englishLevel.slice(1).toLowerCase()}`;

        return (
            <label key={label} htmlFor={label} className="flex gap-2">
                <input type="radio" id={label} name="englishLevel" className="accent-purple-600" value={englishLevel} checked={englishLevel === "Any level" ? !props.englishLevel : props.englishLevel === englishLevel} onChange={englishLevelFilterHandler} />
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