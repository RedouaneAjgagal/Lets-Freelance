import { StatusCodes } from "http-status-codes";
import Service from "../service.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";


//@desc services analysis (createdAt, ratings)
//@route GET /api/v1/services/analysis
//@access authorization (admins & owners)
const getServicesAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_service_duration } = req.query;

    const dateFormat = {
        day: "%Y-%m-%dT%H",
        week: "%Y-%m-%d",
        month: "%Y-%m-%d",
        year: "%Y-%m",
    } as const;

    let createdAtFormat = "%Y";

    const services = await Service.aggregate([
        {
            $match: {
                createdAt: created_service_duration?.toString()
            }
        }
    ])

    res.status(StatusCodes.OK).json(services);
}

export {
    getServicesAnalysis
}