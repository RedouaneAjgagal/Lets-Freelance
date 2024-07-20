import useSearchedTalentsQueries from "../hooks/useSearchedTalentsQueries";
import ClearAllQueriesButton from "./ClearAllQueriesButton";
import RemoveTalentFilter from "./RemoveTalentFilter";

const SelectedTalentFiltersContainer = () => {

    const searchedTalentsQueries = useSearchedTalentsQueries();
    delete searchedTalentsQueries.search;

    const searchedQueries = Object.entries(searchedTalentsQueries);

    return (
        searchedQueries.length
            ? <div className="flex gap-2 flex-wrap px-4 lg:px-0">
                {searchedQueries.map(([key, value]) => (
                    <RemoveTalentFilter key={key} queryKey={key} queryValue={value} />
                ))}
                {searchedQueries.length > 1 ?
                    <ClearAllQueriesButton />
                    : null
                }
            </div>
            : null
    )
}

export default SelectedTalentFiltersContainer