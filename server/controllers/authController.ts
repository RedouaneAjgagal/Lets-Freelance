import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../errors";

const register: RequestHandler = async (req, res) => {
    res.status(StatusCodes.CREATED).json({ result: "success" });
}
const login: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ result: "success" });
}
const forgetPassword: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ result: "success" });
}
const resetPassword: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ result: "success" });
}

export {
    register,
    login,
    forgetPassword,
    resetPassword
}