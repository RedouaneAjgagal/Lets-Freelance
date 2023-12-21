import { BadRequestError } from "../../../errors";
import { ReportWithoutRefs } from "../report.model";
import { isInvalidEvent, isInvalidTarget, isInvalidMessage, isInvalidSubject } from "./inputValidations";

type CreateReportType = Partial<ReportWithoutRefs & { target: string }>;

const createReportValidator = (report: CreateReportType) => {
    const reportData: CreateReportType = {}

    const invalidReportEvent = isInvalidEvent(report.event);
    if (invalidReportEvent) {
        throw new BadRequestError(invalidReportEvent);
    }
    reportData.event = report.event;

    const invalidTarget = isInvalidTarget(report.target);
    if (invalidTarget) {
        throw new BadRequestError(invalidTarget);
    }
    reportData.target = report.target;

    const invalidReportSubject = isInvalidSubject(report.subject);
    if (invalidReportSubject) {
        throw new BadRequestError(invalidReportSubject);
    }
    reportData.subject = report.subject;

    if (report.message && report.message.toString().trim() !== "") {
        const invalidReportMessage = isInvalidMessage(report.message);
        if (invalidReportMessage) {
            throw new BadRequestError(invalidReportMessage);
        }
        reportData.message = report.message;
    }

    return reportData;
}

export default createReportValidator;