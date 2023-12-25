const getDuration = (duration: "day" | "week" | "month" | "year") => {
    const now = new Date();
    const durations = {
        day: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
        week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0),
        month: new Date(now.getFullYear(), now.getMonth(), 0, 0, 0, 0, 0),
        year: new Date(now.getFullYear(), 0, 0, 0, 0, 0, 0)
    }

    return durations[duration];
}

export default getDuration;