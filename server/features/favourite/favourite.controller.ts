import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../../errors";
import Favourite, { FavoutiteWithRefs } from "./favourite.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createFavouriteValidation from "./validators/createFavouriteValidation";
import { IProfile, Profile } from "../profile";
import { serviceModel as Service, ServiceWithoutRefs } from "../service";
import { jobModel as Job } from "../job";
import { IEmployerRole, IFreelancerRole } from "../profile/profile.model";
import { JobTypeWithoutRefs } from "../job/job.model";


type FavouriteType = {
    _id: string;
    event: FavoutiteWithRefs["event"];
}

type ServiceType = {
    service: {
        _id: string;
        title: ServiceWithoutRefs["title"];
        category: ServiceWithoutRefs["category"];
        featuredImage: ServiceWithoutRefs["featuredImage"];
        tier: {
            starter: {
                price: ServiceWithoutRefs["tier"]["starter"]["price"];
            }
        };
    };
    serviceBy: {
        _id: string;
        name: IProfile["name"];
        avatar: IProfile["avatar"];
        userAs: IProfile["userAs"];
        rating: IProfile["rating"];
        country: IProfile["country"];
        roles: {
            freelancer: {
                badge: IFreelancerRole["badge"];
                englishLevel: IFreelancerRole["englishLevel"];
            }
        }
    }
} & FavouriteType;

type JobType = {
    job: {
        _id: string;
        title: JobTypeWithoutRefs["title"];
        description: JobTypeWithoutRefs["description"];
        priceType: JobTypeWithoutRefs["priceType"];
        price: JobTypeWithoutRefs["price"];
        duration: JobTypeWithoutRefs["duration"];
        experienceLevel: JobTypeWithoutRefs["experienceLevel"];
        tags: JobTypeWithoutRefs["tags"];
        createdAt: string;
    }
} & FavouriteType;


type ProfileType = {
    profile: {
        _id: string;
        name: IProfile["name"];
        avatar: IProfile["avatar"];
        userAs: IProfile["userAs"];
        category: IProfile["category"];
        country: IProfile["country"];
        rating: IProfile["rating"];
        roles: {
            freelancer: {
                hourlyRate: IFreelancerRole["hourlyRate"];
                skills: IFreelancerRole["skills"];
                badge: IFreelancerRole["badge"];
                jobTitle: IFreelancerRole["jobTitle"];
            };
            employer: {
                employees: IEmployerRole["employees"];
                totalJobPosted: IEmployerRole["totalJobPosted"];
            }
        }

    }
} & FavouriteType;

type FavouritesAggregate =
    | { _id: string; event: "profile"; profile: ProfileType["profile"] }
    | { _id: string; event: "service"; service: ServiceType["service"]; serviceBy: ServiceType["serviceBy"] }
    | { _id: string; event: "job"; job: JobType["job"] };



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


//@desc get favourites
//@route GET /api/v1/favourites
//@access authentication
const getFavourites: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    const favouritesAggregate: FavouritesAggregate[] = await Favourite.aggregate([
        {
            // get only favourites by the current user
            $match: {
                user: profile.user
            }
        },
        {
            // populate profile documents
            $lookup: {
                from: "profiles",
                localField: "target",
                foreignField: "_id",
                as: "profile"
            }
        },
        {
            // populate service documents
            $lookup: {
                from: "services",
                localField: "target",
                foreignField: "_id",
                as: "service"
            }
        },
        {
            // populate job documents
            $lookup: {
                from: "jobs",
                localField: "target",
                foreignField: "_id",
                as: "job"
            }
        },
        {
            $addFields: {
                profile: {
                    $first: "$profile"
                }
            }
        },
        {
            $addFields: {
                service: {
                    $first: "$service"
                }
            }
        },
        {
            $addFields: {
                job: {
                    $first: "$job"
                }
            }
        },
        {
            // populate the service profile document
            $lookup: {
                from: "profiles",
                localField: "service.profile",
                foreignField: "_id",
                as: "serviceBy"
            }
        },
        {
            $addFields: {
                serviceBy: {
                    $first: "$serviceBy"
                }
            }
        },
        {
            $project: {
                "_id": 1,
                "event": 1,
                // service
                "service._id": 1,
                "service.title": 1,
                "service.category": 1,
                "service.featuredImage": 1,
                "service.tier.starter.price": 1,
                "service.rating": 1,
                "serviceBy._id": 1,
                "serviceBy.name": 1,
                "serviceBy.avatar": 1,
                "serviceBy.userAs": 1,
                "serviceBy.roles.freelancer.badge": 1,
                "serviceBy.roles.freelancer.englishLevel": 1,
                "serviceBy.rating": 1,
                "serviceBy.country": 1,
                // job
                "job._id": 1,
                "job.title": 1,
                "job.description": 1,
                "job.priceType": 1,
                "job.price": 1,
                "job.duration": 1,
                "job.experienceLevel": 1,
                "job.tags": 1,
                "job.createdAt": 1,
                "job.weeklyHours": 1,
                // profile
                "profile._id": 1,
                "profile.name": 1,
                "profile.avatar": 1,
                "profile.userAs": 1,
                "profile.category": 1,
                "profile.country": 1,
                "profile.rating": 1,
                "profile.roles.freelancer.hourlyRate": 1,
                "profile.roles.freelancer.skills": 1,
                "profile.roles.freelancer.badge": 1,
                "profile.roles.freelancer.jobTitle": 1,
                "profile.roles.employer.employees": 1,
                "profile.roles.employer.totalJobPosted": 1
            }
        }
    ]);

    const jobs: JobType[] = [];
    const services: ServiceType[] = [];
    const freelancers: ProfileType[] = [];
    const employers: ProfileType[] = [];

    for (let i = 0; i < favouritesAggregate.length; i++) {
        const favourite = favouritesAggregate[i];

        switch (favourite.event) {
            case "service":
                services.push(favourite);
                break;
            case "job":
                jobs.push(favourite);
                break;
            case "profile":
                if (favourite.profile.userAs === "freelancer") {
                    freelancers.push(favourite);
                } else {
                    employers.push(favourite);
                }
                break;
            default:
                break;
        }
    }

    res.status(StatusCodes.OK).json({
        services,
        jobs,
        freelancers,
        employers
    });
}


export {
    toggleFavourite,
    getFavourites
}