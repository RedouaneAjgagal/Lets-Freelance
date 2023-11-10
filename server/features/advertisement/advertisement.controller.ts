import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createCampaignValidator from "./validators/createCampaignValidator";


//@desc create campaign
//@route POST api/v1/advertisements
//@access authentication (freelancers only)
const createCampaign: RequestHandler = async (req: CustomAuthRequest, res) => {
    const input = req.body;
    createCampaignValidator(input);

    res.status(StatusCodes.CREATED).json({ msg: "Campaign created" });
}


export {
    createCampaign
}
