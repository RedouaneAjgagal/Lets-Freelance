import { useQueryClient } from "@tanstack/react-query";
import EnglishLevelFilter from "../../../components/EnglishLevelFilter";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { isValidEnglishLevel } from "../validators/searchTalentsValidators";

type EnglishLevelType = "Any level" | "professional" | "native" | "fluent" | "conversational" | "basic";

type SearchTalentEnglishLevelFilterProps = {
    SIZE: number;
}

const SearchTalentEnglishLevelFilter = (props: React.PropsWithoutRef<SearchTalentEnglishLevelFilterProps>) => {
    const queryClient = useQueryClient();
    
    const customSearchParams = useCustomSearchParams();

    const englishLevel = customSearchParams.getSearchParams({
        key: "english_level"
    });

    const setEnglishLevelHandler = (englishLevel: "Any level" | "professional" | "native" | "fluent" | "conversational" | "basic") => {
        customSearchParams.setSearchParams({
            key: "english_level",
            value: englishLevel === "Any level" ? "" : englishLevel
        });

        queryClient.removeQueries({ queryKey: ["talents"] });
    }

    const validEnglishLevel = isValidEnglishLevel(englishLevel || "");

    const talentEnglishLevel = validEnglishLevel ? englishLevel as EnglishLevelType : undefined;

    return (
        <EnglishLevelFilter SIZE={props.SIZE} englishLevel={talentEnglishLevel} onSelectEnglishLevel={setEnglishLevelHandler} />
    )
}

export default SearchTalentEnglishLevelFilter