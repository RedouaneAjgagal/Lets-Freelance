import { CancelRequestType, ContractType, ContractRoleType } from "../contract.model";

const isInvalidSubject = (subject: CancelRequestType["subject"] | undefined) => {
    let error = "";

    if (!subject || subject.toString().trim() === "") {
        return error = "Subject is required";
    }

    if (typeof subject !== "string") {
        return error = "Invalid subject format";
    }

    return error;
}

const isInvalidReason = (reason: CancelRequestType["reason"] | undefined) => {
    let error = "";

    if (!reason || reason.toString().trim() === "") {
        return error = "Reason is required";
    }

    if (typeof reason !== "string") {
        return error = "Invalid reason subject format";
    }

    if (reason.length > 5000) {
        return error = "Reason cannot be more than 5000 characters";
    }

    return error;
}

const isInvalidStatus = (status: ContractRoleType["status"] | undefined) => {
    let error = "";

    if (!status || status.toString().trim() === "") {
        return error = "Status is required";
    }

    if (typeof status !== "string") {
        return error = "Invalid status format";
    }

    const statusList = ["inProgress", "completed", "canceled"];
    if (!statusList.includes(status)) {
        return error = "Unsupported status";
    }

    return error;
}

const isInvalidSumbitedWokedHours = (workedHours: number) => {
    let error = "";

    if (!workedHours || workedHours.toString().trim() === "") {
        return error = "Must provide worked hours";
    }

    if (typeof workedHours !== "number") {
        return error = "Invalid worked hours format";
    }

    if (workedHours < 1) {
        return error = "Cannot submit less than one hour";
    }

    if (Math.floor(workedHours) !== workedHours) {
        return error = "Cant set decimal number";
    }

    return error;
}

export {
    isInvalidSubject,
    isInvalidReason,
    isInvalidStatus,
    isInvalidSumbitedWokedHours
}