import CustomApiError from "./custom-error";
import { StatusCodes } from "http-status-codes";

class UnauthorizedError extends CustomApiError {
    statusCode: StatusCodes;
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export default UnauthorizedError;