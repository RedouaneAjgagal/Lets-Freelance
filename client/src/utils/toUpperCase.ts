const toUpperCaseWord = (word: string) => {
    return `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
};


const toUpperCase = ({ value, everyWord }: { value: string; everyWord?: boolean }) => {
    if (everyWord) {
        return value.split(" ").map(word => toUpperCaseWord(word)).join(" ");
    }

    return toUpperCaseWord(value);
};

export default toUpperCase;