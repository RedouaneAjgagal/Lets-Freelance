import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../../errors";
import Favourite from "./favourite.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createFavouriteValidation from "./validators/createFavouriteValidation";
import { Profile } from "../profile";
import { serviceModel as Service } from "../service";
import { jobModel as Job } from "../job";
import { User } from "../auth";


//@desc toggle events (jobs, services or profiles) to favourite or unfavourite
//@route POST /api/v1/favourites
//@access authentication
const toggleFavourite: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { event, target: tagetId } = req.body;

    // check if valid inputs 
    const favouriteData = createFavouriteValidation({
        event,
        target: tagetId
    });

    const targets = {
        profile: Profile.findById(favouriteData.target),
        service: Service.findById(favouriteData.target),
        job: Job.findById(favouriteData.target)
    } as const;

    // find target and check if it exist
    const target = await targets[favouriteData.event];
    if (!target) {
        throw new BadRequestError(`Found no ${favouriteData.event} with ID ${favouriteData.target}`);
    }

    // dont allow to favourite own targets (service, job or profile)
    if (target.user._id.toString() === req.user!.userId) {
        throw new BadRequestError(`You can't favourite your own ${favouriteData.event}`);
    }

    // if the target already has been created then delete it (toggle)
    const alreadyExistTarget = await Favourite.findOne({ user: req.user!.userId, target: target.id });
    if (alreadyExistTarget) {
        alreadyExistTarget.deleteOne();
        return res.status(StatusCodes.OK).json({ msg: `${favouriteData.event} has been removed from favourites`, status: "remove" });
    }

    // create favourite
    Favourite.create({
        user: req.user!.userId,
        event: favouriteData.event,
        target: favouriteData.target
    });

    res.status(StatusCodes.CREATED).json({ msg: `New ${favouriteData.event} has been added to favourites`, status: "add" });
}

export {
    toggleFavourite
}