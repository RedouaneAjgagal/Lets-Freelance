import CountryFilter from "../../../components/CountryFilter";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";


const SearchServicesLocationFilter = () => {
    const { country } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const setCountryHandler = (country: string) => {
        dispatch(filterSearchedServicesAction.filterByCountry(country));
    }

    return (
        <CountryFilter onApplyCountry={setCountryHandler} country={country} />
    )
}

export default SearchServicesLocationFilter