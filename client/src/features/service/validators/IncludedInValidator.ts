type IncludedInType = {
    type: "description" | "result";
    value: string;
};

const IncludedInValidator = ({ type, value }: IncludedInType) => {
    const result = {
        isError: false,
        msg: ""
    };

    if (value.toString().trim() === "") {
        result.isError = true;
        result.msg = "Can't be empty";
    }

    if (type === "result") {
        const isNotNumber = Number.isNaN(value);
        if (value !== "false" && value !== "true" && isNotNumber) {
            result.isError = true;
            result.msg = "Invalid type"
        }
    }

    return result;
};

export default IncludedInValidator;