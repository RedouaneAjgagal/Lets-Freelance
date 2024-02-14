const isValidGeneralTierInput = (value: string) => {
    const result = {
        isError: false,
        msg: ""
    }

    if (!value || value.toString().trim() === "") {
        result.isError = true;
        result.msg = "Required, can't be empty";
        return result;
    }

    const getValueNumber = Number(value);
    const isInvalidNumber = Number.isNaN(getValueNumber);
    if (isInvalidNumber) {
        result.isError = true;
        result.msg = "Invalid number";
        return result;
    }

    if (Math.floor(getValueNumber) <= 0) {
        result.isError = true;
        result.msg = "1 is the minimum";
        return result;
    }

    return result;
}

export default isValidGeneralTierInput;