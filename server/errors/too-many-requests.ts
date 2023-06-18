import CustomApiError from "./custom-error";
import { StatusCodes } from "http-status-codes";

class TooManyRequestsError extends CustomApiError {
    statusCode: StatusCodes;
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.TOO_MANY_REQUESTS;
    }
}

export default TooManyRequestsError;