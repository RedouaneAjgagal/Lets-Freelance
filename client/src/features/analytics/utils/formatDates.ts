type FormatDatesPayload = {
    barDataKey: string;
    dateType?: "day" | "week" | "month" | "year";
    value: {
        _id: string;
    }[];
}

type FormatRequestDatesPayload = {
    dateType?: "day" | "week" | "month" | "year";
    value: string | number;
}

export const formatRequestDates = (payload: FormatRequestDatesPayload) => {
    const date = new Date();
    switch (payload.dateType) {
        case "year":
            const getYear = Number.isNaN(Number(payload.value))
                ? Number(payload.value.toString().split("-")[1]) - 1
                : payload.value;

            const yearDateValue = new Date(date.setMonth(Number(getYear)));
            const yearValue = yearDateValue.toLocaleDateString("en-US", { month: "short", year: "numeric" });

            return yearValue;
        case "month":
            const getMonth = Number.isNaN(Number(payload.value))
                ? new Date(payload.value)
                : new Date(date.setDate(Number(payload.value)))

            const monthValue = getMonth.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit"
            });

            return monthValue;
        case "week":

            const getWeek = Number.isNaN(Number(payload.value))
                ? new Date(payload.value)
                : new Date(Date.now() - (Number(payload.value) * 24 * 60 * 60 * 1000));

            const weekValue = getWeek.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit"
            });

            return weekValue;

        case "day":
            const getDay = Number.isNaN(Number(payload.value))
                ? new Date(date.setHours(new Date(`${payload.value}:00:00.000Z`).getHours() - 1, 0, 0, 0))
                : new Date(date.setHours(Number(payload.value), 0, 0, 0));

            const dayValue = `${getDay.getHours().toString().padStart(2, "0")}:00`;

            return dayValue;
        default:
            return payload.value.toString();
    }
}

const formatDates = (payload: FormatDatesPayload) => {
    const data: {
        _id: string;
        [key: string]: string | number;
    }[] = [];

    switch (payload.dateType) {
        case "day":
            for (let i = 0; i < 24; i++) {
                const dayValue = formatRequestDates({
                    value: i,
                    dateType: "day"
                });

                data.push({
                    _id: dayValue,
                    [payload.barDataKey]: 0
                });
            }

            break;
        case "week":
            for (let i = 0; i < 7; i++) {
                const weekValue = formatRequestDates({
                    value: i,
                    dateType: "week"
                });
                data.push({
                    _id: weekValue,
                    [payload.barDataKey]: 0
                });
            }

            break;
        case "month":
            const lastDayOfTheMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);


            for (let i = 0; i < lastDayOfTheMonth.getDate(); i++) {
                const monthValue = formatRequestDates({
                    value: i + 1,
                    dateType: "month"
                });
                data.push({
                    _id: monthValue,
                    [payload.barDataKey]: 0
                });
            }
            break;
        case "year":
            for (let i = 0; i < 12; i++) {
                const yearValue = formatRequestDates({
                    value: i,
                    dateType: "year"
                });

                data.push({
                    _id: yearValue,
                    [payload.barDataKey]: 0
                });

            }

            break;
        default:
            const getYear = new Date().getFullYear();
            const firstYear = payload.value.reduce((previousValue, currentValue) => {
                const year = Number(currentValue._id);
                if (year < previousValue) {
                    return year
                };

                return previousValue;
            }, getYear);

            for (let i = 0; i < (getYear - (firstYear - 1)); i++) {
                const date = new Date();
                const dateValue = new Date(date.setFullYear(getYear - i))
                const yearValue = dateValue.getFullYear().toString();

                data.push({
                    _id: yearValue,
                    [payload.barDataKey]: 0
                });
            }

            break;
    }

    const newData = [...payload.value, ...data]
        .filter((data, index, arr) => {
            return arr.findIndex((d) => d._id === data._id) === index;
        });

    const uniqueData = [...new Set(newData)];

    uniqueData.sort((a, b) => {
        if (payload.dateType === "day") {
            const a_hour = a._id.split(":")[0];
            const b_hour = b._id.split(":")[0];

            return Number(a_hour) - Number(b_hour);
        }
        return new Date(a._id).getTime() - new Date(b._id).getTime();
    });

    return uniqueData;

}

export default formatDates;