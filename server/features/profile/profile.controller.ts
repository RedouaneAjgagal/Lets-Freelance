import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { CustomAuthRequest } from "../../middlewares/authentication";

const profileInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.OK).json({ msg: "Profile info" });
}

export {
    profileInfo
}