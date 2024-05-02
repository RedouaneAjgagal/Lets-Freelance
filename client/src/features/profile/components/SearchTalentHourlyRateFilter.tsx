import { useQueryClient } from "@tanstack/react-query";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { SEARCHED_TALENT_HOURLY_RATES } from "../helpers/getValidSearchedTalentQueries";
import { isValidHourlyRate } from "../validators/searchTalentsValidators";


const SearchTalentHourlyRateFilter = () => {
    const queryClient = useQueryClient();
    
    const customSearchParams = useCustomSearchParams();

    const searchedHourlyRate = customSearchParams.getSearchParams({
        key: "hourly_rate"
    });

    const hourlyRates = [
        {
            label: "Any hourly rate",
            value: "0"
        },
        {
            label: "$10 and below",
            value: "1,10"
        },
        {
            label: "$10 - $30",
            value: "10,30"
        },
        {
            label: "$30 - $60",
            value: "30,60"
        },
        {
            label: "$60 & above",
            value: "60,999"
        },
    ];

    const setHourlyRateHandler = (hourlyRate: string) => {
        customSearchParams.setSearchParams({
            key: "hourly_rate",
            value: hourlyRate === "0" ? "" : hourlyRate
        });

        queryClient.removeQueries({ queryKey: ["telents"] });
    }

    const validHourlyRate = isValidHourlyRate({
        validHourlyRates: SEARCHED_TALENT_HOURLY_RATES,
        hourlyRate: searchedHourlyRate || ""
    });

    const talentHourlyRate = validHourlyRate ? searchedHourlyRate! : undefined;

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Hourly Rate</h4>
            <div className="flex flex-col gap-2">
                {hourlyRates.map(hourlyRate => (
                    <label key={hourlyRate.label} htmlFor={hourlyRate.label} className="flex gap-2">
                        <input type="radio" id={hourlyRate.label} name="hourly-rate" className="accent-purple-600" value={hourlyRate.value} onChange={() => setHourlyRateHandler(hourlyRate.value)} checked={hourlyRate.value === "0" ? !talentHourlyRate : hourlyRate.value === talentHourlyRate} />
                        {hourlyRate.label}
                    </label>
                ))}
            </div>
        </div>
    )
}

export default SearchTalentHourlyRateFilter 