type EmptyValuesChecker = {
    allowedType: "string" | "number" | "boolean" | "function" | "object";
    errorValue: string;
    value: string | number | undefined;
}

const emptyValuesChecker = ({ allowedType, errorValue, value }: EmptyValuesChecker) => {
    let error = "";
    if (!value || value.toString().trim() === "") {
        return error = `${errorValue} is required`;
    }

    if (typeof value !== allowedType) {
        return error = `Invalid ${errorValue} format`;
    }
    return error;
}

export default emptyValuesChecker;