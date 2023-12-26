const getRating = (rating: "low" | "mid" | "high") => {
    const rates = {
        low: {
            min: 1,
            max: 3
        },
        mid: {
            min: 3,
            max: 4.5
        },
        high: {
            min: 4.5,
            max: 5
        }
    } as const;

    return rates[rating];
}

export default getRating