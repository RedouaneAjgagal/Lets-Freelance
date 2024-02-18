export type JobSearchedQueriesType = {
    search?: string;
    project_price?: string;
    project_type?: string;
    project_length?: string;
    hours_per_week?: string;
    location_type?: string;
    experience_level?: string;
    category?: string;
    page?: string;
}

const getJobSerchedQuries = (searchParams: URLSearchParams) => {
    const search = searchParams.get("search")?.toString();
    const project_price = searchParams.get("project_price")?.toString();
    const project_type = searchParams.get("project_type")?.toString();
    const project_length = searchParams.get("project_length")?.toString();
    const hours_per_week = searchParams.get("hours_per_week")?.toString();
    const location_type = searchParams.get("location_type")?.toString();
    const category = searchParams.get("category")?.toString();
    const experience_level = searchParams.get("experience_level")?.toString();
    const page = searchParams.get("page")?.toString();

    const jobSearchedQueries: JobSearchedQueriesType = {
        search,
        project_price,
        project_type,
        project_length,
        hours_per_week,
        location_type,
        experience_level,
        category,
        page
    }

    return jobSearchedQueries
}

export default getJobSerchedQuries;