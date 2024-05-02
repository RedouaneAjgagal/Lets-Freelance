import { useQueryClient } from '@tanstack/react-query';
import CountryFilter from '../../../components/CountryFilter'
import useCustomSearchParams from '../../../hooks/useCustomSearchParams'
import { isValidLocation } from '../validators/searchTalentsValidators';

const SearchTalentLocationFilter = () => {
    const queryClient = useQueryClient();

    const customSearchParams = useCustomSearchParams();

    const country = customSearchParams.getSearchParams({
        key: "country"
    });


    const setCountryHandler = (country: string) => {
        customSearchParams.setSearchParams({
            key: "country",
            value: country
        });

        queryClient.removeQueries({ queryKey: ["telents"] });
    }

    const validLocation = isValidLocation(country || "");

    const talentLocation = validLocation ? country! : undefined;

    return (
        <CountryFilter onApplyCountry={setCountryHandler} country={talentLocation} />
    )
}

export default SearchTalentLocationFilter