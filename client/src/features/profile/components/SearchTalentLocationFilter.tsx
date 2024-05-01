import CountryFilter from '../../../components/CountryFilter'
import useCustomSearchParams from '../../../hooks/useCustomSearchParams'
import { isValidLocation } from '../validators/searchTalentsValidators';

const SearchTalentLocationFilter = () => {
    const customSearchParams = useCustomSearchParams();

    const country = customSearchParams.getSearchParams({
        key: "country"
    });


    const setCountryHandler = (country: string) => {
        customSearchParams.setSearchParams({
            key: "country",
            value: country
        });
    }

    const validLocation = isValidLocation(country || "");

    const talentLocation = validLocation ? country! : undefined;

    return (
        <CountryFilter onApplyCountry={setCountryHandler} country={talentLocation} />
    )
}

export default SearchTalentLocationFilter