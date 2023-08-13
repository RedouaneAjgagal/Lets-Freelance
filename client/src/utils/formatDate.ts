const formatDate = (date: string | Date) => {
    const formatDateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    const formattedDate = new Date(date).toLocaleDateString("en-US", formatDateOptions);
    return formattedDate;
}

export default formatDate;