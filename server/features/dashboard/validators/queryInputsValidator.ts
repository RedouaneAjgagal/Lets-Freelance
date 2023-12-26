const isInvalidDuration = (duration: string) => {
    if (!duration || duration.toString().trim() === "") {
        return "Duration is required";
    }

    if (typeof duration !== "string") {
        return "Invalid duration format";
    }

    const validDurations = ["day", "week", "month", "year"];
    if (!validDurations.includes(duration)) {
        return "Invalid duration. Can only be `day`, `week`, `month` or `year`";
    }

    return "";
}

const isInvalidRating = (rating: string) => {
    if (!rating || rating.toString().trim() === "") {
        return "Rating is required";
    }

    if (typeof rating !== "string") {
        return "Invalid rating format";
    }

    const validRatings = ["low", "mid", "high"];
    if (!validRatings.includes(rating)) {
        return "Invalid raring. Can only be `low`, `mid` or `high`";
    }

    return "";
}

export {
    isInvalidDuration,
    isInvalidRating
}