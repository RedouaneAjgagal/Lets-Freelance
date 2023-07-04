import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"

const getCurrentUser: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ name: "red" });
}

export {
    getCurrentUser
}