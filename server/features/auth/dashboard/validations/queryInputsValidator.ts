const isInvalidDuration = (duration: string) => {
    if (!duration || duration.toString().trim() === "") {
        return "Duration is required";
    }

    if (typeof duration !== "string") {
        return "Invalid duration format";
    }

    const validDurations = ["day", "week", "month", "year"];
    if (!validDurations.includes(duration)) {
        return "Invalid duration. Can only be `day`, `week`, `month`, or `year`";
    }

    return "";
}

export {
    isInvalidDuration
}