const getMongodbDateFormat = (duration: "day" | "week" | "month" | "year") => {
    const dateFormat = {
        day: "%Y-%m-%dT%H",
        week: "%Y-%m-%d",
        month: "%Y-%m-%d",
        year: "%Y-%m",
    } as const;

    return dateFormat[duration];
}

export default getMongodbDateFormat;