import { GetJobsPayload } from "../service/getJobs";
import { JobSearchedQueriesType } from "../utils/getAllJobSerchedQuries";

const getValidJobSearchedQueries = (searchedQueries: JobSearchedQueriesType) => {
    const validSearchedQueries: GetJobsPayload = {};

    if (searchedQueries.search && searchedQueries.search.trim() !== "") {
        validSearchedQueries.search = searchedQueries.search;
    }

    const isValidProjectPrice = searchedQueries.project_price && searchedQueries.project_price.toString().trim() !== "" && /^\d+-\d+$/.test(searchedQueries.project_price.toString());
    if (isValidProjectPrice) {
        validSearchedQueries.project_price = searchedQueries.project_price;
    }

    const projectTypes = ["hourly", "fixed"];
    if (searchedQueries.project_type && projectTypes.includes(searchedQueries.project_type)) {
        validSearchedQueries.project_type = searchedQueries.project_type;
    }

    const isValidProjectLength = searchedQueries.project_length && searchedQueries.project_length.toString().trim() !== "" && /^[a-zA-Z]+\s*(<|>)\s*\d+$/.test(searchedQueries.project_length.toString());
    if (isValidProjectLength) {
        validSearchedQueries.project_length = searchedQueries.project_length;
    }

    const isValidHoursPerWeek = searchedQueries.hours_per_week && searchedQueries.hours_per_week.toString().trim() !== "" && /^\d+-\d+$/.test(searchedQueries.hours_per_week.toString());
    if (isValidHoursPerWeek) {
        validSearchedQueries.hours_per_week = searchedQueries.hours_per_week;
    }

    const locationTypes = ["onsite", "remote"];
    if (searchedQueries.location_type && locationTypes.includes(searchedQueries.location_type)) {
        validSearchedQueries.location_type = searchedQueries.location_type as GetJobsPayload["location_type"];
    }

    const categories = ["digital-marketing", "design-creative", "programming-tech", "writing-translation", "video-animation", "finance-accounting", "music-audio"];
    if (searchedQueries.category && categories.includes(searchedQueries.category)) {
        validSearchedQueries.category = searchedQueries.category as GetJobsPayload["category"];
    }

    const experienceLevelTypes = ["entry-level", "intermediate", "expert"];
    if (searchedQueries.experience_level && experienceLevelTypes.includes(searchedQueries.experience_level)) {
        validSearchedQueries.experience_level = searchedQueries.experience_level as GetJobsPayload["experience_level"];
    }

    const isValidPage = searchedQueries.page && !Number.isNaN(Number(searchedQueries.page));
    if (isValidPage) {
        validSearchedQueries.page = Math.floor(Number(searchedQueries.page)).toString();
    }

    return validSearchedQueries;
}

export default getValidJobSearchedQueries;