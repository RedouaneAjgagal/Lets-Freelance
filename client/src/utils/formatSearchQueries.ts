const formatSearchQueries = (query: {}) => {
    const searchQueries = Object.entries(query).map(([key, value]) => {
        if (value === undefined) return;
        return `${key}=${value}`;
    });

    const searchQuery = searchQueries.length ? `?${searchQueries.join("&")}` : "";

    return searchQuery;
}

export default formatSearchQueries;