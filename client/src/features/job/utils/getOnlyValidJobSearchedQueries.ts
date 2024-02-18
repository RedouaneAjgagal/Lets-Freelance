import getValidJobSearchedQueries from "../validators/getValidJobSearchedQueries";
import getAllJobSerchedQuries from "./getAllJobSerchedQuries";

const getOnlyValidJobSearchedQueries = (URLSearchParams: URLSearchParams) => {
    const jobSearchedQueries = getAllJobSerchedQuries(URLSearchParams);

    const searchedQueries = getValidJobSearchedQueries(jobSearchedQueries);

    return searchedQueries;
}

export default getOnlyValidJobSearchedQueries;