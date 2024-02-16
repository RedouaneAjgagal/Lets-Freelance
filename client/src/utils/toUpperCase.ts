const toUpperCaseWord = (word: string) => {
    return `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
};


const toUpperCase = ({ value, everyWord, splitBy }: { value: string; everyWord?: boolean; splitBy?: string }) => {
    if (everyWord) {
        return value.split(splitBy ? ` ${splitBy} ` : " ").map(word => toUpperCaseWord(word)).join(splitBy ? ` ${splitBy} ` : " ");
    }

    return toUpperCaseWord(value);
};

export default toUpperCase;