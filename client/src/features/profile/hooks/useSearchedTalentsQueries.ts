import { useSearchParams } from 'react-router-dom';
import getValidSearchedTalentQueries from '../helpers/getValidSearchedTalentQueries';

const useSearchedTalentsQueries = () => {
    const [URLSearchParams] = useSearchParams();

    const search = URLSearchParams.get("search");
    const badge = URLSearchParams.get("badge");
    const rating = URLSearchParams.get("rating");
    const revenue = URLSearchParams.get("revenue");
    const hourlyRate = URLSearchParams.get("hourly_rate");
    const category = URLSearchParams.get("category");
    const englishLevel = URLSearchParams.get("english_level");
    const country = URLSearchParams.get("country");
    const talentType = URLSearchParams.get("talent_type");

    const searchedTalentQueries = {
        search,
        badge,
        rating,
        revenue,
        hourlyRate,
        category,
        englishLevel,
        country,
        talentType
    };

    const validSearchedTalentQueries = getValidSearchedTalentQueries(searchedTalentQueries);
    return validSearchedTalentQueries;
}

export default useSearchedTalentsQueries