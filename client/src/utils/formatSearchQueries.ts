const formatSearchQueries = (query: {}) => {
    const searchQueries = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`;
    });

    const searchQuery = searchQueries.length ? `?${searchQueries.join("&")}` : "";

    return searchQuery;
}

export default formatSearchQueries;