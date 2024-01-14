type Units = "year" | "month" | "day" | "hour" | "min" | "sec";

const formatPostedTime = ({ postedAt }: { postedAt: Date | string }) => {
    const now = new Date();

    const createdAt = new Date(postedAt);

    const timeDiff = now.getTime() - createdAt.getTime();

    const timesInMs = {
        "year": 365 * 24 * 60 * 60 * 1000,
        "month": 30 * 24 * 60 * 60 * 1000,
        "day": 24 * 60 * 60 * 1000,
        "hour": 60 * 60 * 1000,
        "min": 60 * 1000,
        "sec": 1000,
    } as const;

    let unit: Units = "sec";
    let diff = Math.floor(timeDiff / timesInMs[unit]);

    for (const key in timesInMs) {
        if (timesInMs.sec * 59 > timeDiff) break;

        if (timeDiff >= timesInMs[key as Units]) {
            unit = key as Units;
            diff = Math.floor((timeDiff) / timesInMs[key as Units]);
            break;
        }
    }

    const pluralize: "s" | "" = diff > 1 ? "s" : "";

    return { diff, unit, pluralize };
}

export default formatPostedTime;