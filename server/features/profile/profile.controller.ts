import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { CustomAuthRequest } from "../../middlewares/authentication";
import Profile, { IProfile } from "./profile.model";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import getProfileInfo from "./utils/getProfileInfo";
import getUpdatedProfileInfo from "./helpers/getUpdatedProfileInfo";
import { destroyCookie } from "../../utils/cookies";
import { UploadedFile } from "express-fileupload";
import uploadImage from "../../utils/uploadImage";
import isInvalidConnect from "./validators/buyConnectsValidator";
import stripe from "../../stripe/stripeConntect";
import { IService, serviceModel as Service } from "../service";
import { contractModel as Contract } from "../contract";
import { jobModel as Job, JobType } from "../job";
import mongoose, { PipelineStage } from "mongoose";
import "./badge_upgrade/upgrades";
import searchFreelancersQueryValidator from "./validators/searchQueriesValidator";
import createHash from "../../utils/createHash";
import getUserPayload from "../../utils/getUserPayload";
import origin from "../../config/origin";

type Freelancer = {
    projectSuccess: number;
    totalService: number;
    completedService: number;
    inQueueService: number;
    services: (mongoose.FlattenMaps<IService> & { _id: mongoose.Types.ObjectId; })[]
}

type Employer = {
    openJobs: (mongoose.FlattenMaps<JobType> & { _id: mongoose.Types.ObjectId; })[];
}

type FreelancerProfile = Partial<IProfile> & { userAs: "freelancer" } & Partial<Freelancer>;
type EmployerProfile = Partial<IProfile> & { userAs: "employer" } & Partial<Employer>;
type ProfileData = FreelancerProfile | EmployerProfile


//@desc get current user profile
//@route GET /api/v1/profiles
//@access authentication
const profileInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "email role" });
    if (!profile) {
        throw new UnauthenticatedError("Cannot find any profile");
    }
    const profileInfo = getProfileInfo(profile.toObject());
    res.status(StatusCodes.OK).json(profileInfo);
}


//@desc get signle profile info 
//@route GET /api/v1/profiles/:profileId
//@access public
const singleProfile: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    const { accessToken } = req.signedCookies;

    const isValidMongodbId = mongoose.isValidObjectId(profileId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid profile ID");
    }

    const user = getUserPayload({
        accessToken: accessToken || ""
    });

    const [profile] = await Profile.aggregate([
        {
            // get profile related to this ID
            $match: {
                _id: new mongoose.Types.ObjectId(profileId)
            }
        },
        {
            // populate services related to this profile
            $lookup: {
                from: "services",
                foreignField: "profile",
                localField: "_id",
                as: "services"
            }
        },
        {
            // populate jobs related to this profile
            $lookup: {
                from: "jobs",
                foreignField: "profile",
                localField: "_id",
                as: "jobs"
            }
        },
        {
            // get only open jobs
            $addFields: {
                openJobs: {
                    $filter: {
                        input: "$jobs",
                        as: "job",
                        cond: {
                            $eq: ["$$job.status", "open"]
                        }
                    }
                }
            }
        },
        {
            // populate contracts related to this profile (freelancer)
            $lookup: {
                from: "contracts",
                foreignField: "freelancer.profile",
                localField: "_id",
                as: "contracts"
            }
        },
        {
            // get completed jobs
            $addFields: {
                completedJobs: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $and: [
                                { $eq: ["$$contract.activityType", "job"] },
                                { $eq: ["$$contract.freelancer.status", "completed"] },
                                { $eq: ["$$contract.employer.status", "completed"] }
                            ]
                        }
                    }
                }
            }
        },
        {
            // get the size of completed jobs
            $addFields: {
                projectSuccess: {
                    $size: "$completedJobs"
                }
            }
        },
        {
            // get completed services
            $addFields: {
                completedServices: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $and: [
                                { $eq: ["$$contract.activityType", "service"] },
                                { $eq: ["$$contract.freelancer.status", "completed"] },
                                { $eq: ["$$contract.employer.status", "completed"] }
                            ]
                        }
                    }
                }
            }
        },
        {
            // get the size of completed services
            $addFields: {
                completedService: {
                    $size: "$completedServices"
                }
            }
        },
        {
            // get in progress services
            $addFields: {
                inQueueServices: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $and: [
                                { $eq: ["$$contract.activityType", "service"] },
                                {
                                    $or: [
                                        { $eq: ["$$contract.freelancer.status", "inProgress"] },
                                        { $eq: ["$$contract.employer.status", "inProgress"] }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            // get the size of in progress services
            $addFields: {
                inQueueService: {
                    $size: "$inQueueServices"
                }
            }
        },
        {
            // get the size of services
            $addFields: {
                totalServices: {
                    $size: "$services"
                }
            }
        },
        {
            // populate favorites related to this profile
            $lookup: {
                from: "favourites",
                foreignField: "target",
                localField: "_id",
                as: "favorites"
            }
        },
        {
            // get only favorites related to this current user (if logged in)
            $addFields: {
                favorites: {
                    $filter: {
                        input: "$favorites",
                        as: "favorite",
                        cond: {
                            $and: [
                                { $eq: ["$$favorite.event", "profile"] },
                                { $eq: ["$$favorite.user", new mongoose.Types.ObjectId(user?.userId)] }
                            ]
                        }
                    }
                }
            }
        },
        {
            // check if it has been favorited
            $addFields: {
                isFavorited: {
                    $cond: [
                        {
                            $eq: [{ $size: "$favorites" }, 0]
                        },
                        false,
                        true
                    ]
                }
            }
        },
        {
            $project: {
                _id: 1,
                user: 1,
                name: 1,
                avatar: 1,
                showProfile: 1,
                userAs: 1,
                country: 1,
                phoneNumber: 1,
                description: 1,
                category: 1,
                roles: {
                    $cond: [
                        { $eq: ["$userAs", "freelancer"] },
                        { freelancer: "$roles.freelancer" },
                        { employer: "$roles.employer" }
                    ]
                },
                rating: 1,
                isFavorited: 1,
                createdAt: 1,
                projectSuccess: {
                    $cond: [
                        { $eq: ["$userAs", "freelancer"] },
                        "$projectSuccess",
                        "$$REMOVE"
                    ]
                },
                completedService: {
                    $cond: [
                        { $eq: ["$userAs", "freelancer"] },
                        "$completedService",
                        "$$REMOVE"
                    ]
                },
                inQueueService: {
                    $cond: [
                        { $eq: ["$userAs", "freelancer"] },
                        "$inQueueService",
                        "$$REMOVE"
                    ]
                },
                totalServices: {
                    $cond: [
                        { $eq: ["$userAs", "freelancer"] },
                        "$totalServices",
                        "$$REMOVE"
                    ]
                },
                openJobs: {
                    $cond: [
                        { $eq: ["$userAs", "employer"] },
                        "$openJobs",
                        "$$REMOVE"
                    ]
                },
                services: {
                    $cond: [
                        { $eq: ["$userAs", "freelancer"] },
                        "$services",
                        "$$REMOVE"
                    ]
                }
            }
        },
        {
            $project: {
                "roles.freelancer.connects": false,
                "roles.freelancer.advertisement": false,
                "openJobs.user": false,
                "openJobs.profile": false,
                "openJobs.description": false,
                "openJobs.duration": false,
                "openJobs.weeklyHours": false,
                "openJobs.experienceLevel": false,
                "openJobs.connects": false,
                "openJobs.tags": false,
                "openJobs.status": false,
                "openJobs.updatedAt": false,
                "services.user": false,
                "services.profile": false,
                "services.description": false,
                "services.gallery": false,
                "services.keywords": false,
                "services.tier.starter.deliveryTime": false,
                "services.tier.starter.includedIn": false,
                "services.tier.standard": false,
                "services.tier.advanced": false,
                "services.orders": false,
                "services.createdAt": false,
                "services.updatedAt": false,
            }
        },
    ]);

    if (!profile) {
        throw new NotFoundError("Found no profile");
    }

    res.status(StatusCodes.OK).json(profile);
}


//@desc upload profile avatar
//@route POST /api/v1/profiles
//@access authentication
const uploadAvatar: RequestHandler = async (req: CustomAuthRequest, res) => {
    const imageFile = req.files?.avatar as UploadedFile;
    const maxSize = 1024 * 1024;
    const imageResponse = await uploadImage({
        folderName: "avatars_lets-freelance",
        imageFile,
        maxSize
    });

    res.status(StatusCodes.OK).json({ avatarURL: imageResponse.secure_url });
}


//@desc update profile
//@route PATCH /api/v1/profiles
//@access authentication
const updateProfile: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Cannot find any profile");
    }

    // get the correct updated profile info
    const updatedProfileInfo = getUpdatedProfileInfo({
        newProfileInfo: req.body.profileInfo || {},
        roles: profile.roles,
        userAs: profile.userAs
    });

    await profile.updateOne(updatedProfileInfo);

    res.status(StatusCodes.OK).json({ msg: "Profile has been updated" });
}


//@desc delete current user profile
//@route DELETE /api/v1/profiles
//@access authentication
const deleteProfile: RequestHandler = async (req: CustomAuthRequest, res) => {
    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "role" });

    if (!profile) {
        throw new UnauthenticatedError("Found no profile");
    }

    // unable to delete owner roles
    if (profile.user.role === "owner") {
        throw new BadRequestError("Owner roles cannot be deleted");
    }

    const isDeleteProfileDisabled = true;
    if (isDeleteProfileDisabled) {
        throw new BadRequestError("account deletions are temporarily disabled");
    }

    // delete profile
    await profile.deleteOne();

    // destroy auth cookie
    destroyCookie({
        cookieName: "accessToken",
        res
    });

    res.status(StatusCodes.OK).json({ msg: "Your account has been deleted permanently" });
}


//@desc delete single profile
//@route DELETE /api/v1/profiles/:profileId
//@access authorization
const deleteSingleProfile: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { profileId } = req.params;
    if (!profileId || profileId.trim() === "") {
        throw new BadRequestError("Must provide a profile id");
    }

    // find the target profile
    const ressourceProfile = await Profile.findById(profileId).populate({ path: "user", select: "role" });
    if (!ressourceProfile) {
        throw new NotFoundError("Found no profile");
    }

    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "role" });
    if (!profile) {
        throw new UnauthenticatedError("Found no profile");
    }

    // check if its the current user profile
    if (ressourceProfile._id.toString() === profile._id.toString()) {
        throw new BadRequestError("Cannot delete your account");
    }

    // only delete users but owner can delete any
    if (ressourceProfile.user.role !== "user" && profile.user.role !== "owner" || ressourceProfile.user.role === "owner") {
        throw new UnauthorizedError(`You dont have access to delete ${ressourceProfile.user.role} roles.`);
    }

    const isDeleteProfileDisabled = true;
    if (isDeleteProfileDisabled) {
        throw new BadRequestError("Account deletions are temporarily disabled");
    }

    // delete profile
    await ressourceProfile.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Account has been deleted" });
}


//@desc buy connects for freelancers
//@route POST /api/v1/profiles/connects
//@access authentication (freelancers only)
const buyConnects: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { connects } = req.body;

    // check if valid connects value
    const invalidConnects = isInvalidConnect(connects);
    if (invalidConnects) {
        throw new BadRequestError(invalidConnects);
    }

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "email" });
    if (!profile) {
        throw new UnauthorizedError("Found no user");
    }

    // check if profile is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("Only freelancers have access to buy connects");
    }

    // get connect product
    const connectProduct = await stripe.products.retrieve("prod_OpXMa2pFYUTp65");

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        currency: "usd",
        client_reference_id: profile.user._id.toString(),
        line_items: [
            {
                price: connectProduct.default_price!.toString(), // 0.34 usd
                quantity: connects
            }
        ],
        success_url: `${origin}/profile/freelancer/connects/buy?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: origin,
        customer_email: profile.user.email,
        metadata: {
            freelancerId: profile.user._id.toString(),
            connects
        }
    });

    console.log(session.url);

    profile.roles.freelancer!.connects.payments.push({
        status: "pending",
        sessionId: session.id,
        connectionsCount: connects
    });

    await profile.save();

    res.status(StatusCodes.OK).json({ url: session.url });
}


//@desc set connects to paid and increase profile connects
//@route PATCH /api/v1/profiles/connects
//@access authentication (freelancers only)
const setPaidConnects: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { session_id } = req.query;

    if (!session_id) {
        throw new BadRequestError("Session ID is required");
    }

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthorizedError("Found no user");
    }

    // check if the user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("Must be a freelancer");
    }

    // find the payment
    const payment = profile.roles.freelancer!.connects.payments.find(payment => payment.sessionId === session_id);
    if (!payment) {
        throw new BadRequestError(`Found no payment with session ID ${session_id}`);
    }

    // check if the payment is at pending status
    if (payment.status !== "pending") {
        throw new BadRequestError("Only pending payments are valid to set as paid");
    }

    // find session
    const session = await stripe.checkout.sessions.retrieve(payment.sessionId);
    if (!session) {
        throw new BadRequestError(`Found no session with ID ${payment.sessionId}`);
    }

    // check if the session has been paid
    if (session.payment_status !== "paid") {
        throw new BadRequestError("Must pay the connects first");
    }

    // set payment description to connect purchase
    const paymentIntent = await stripe.paymentIntents.update(session.payment_intent!.toString(), {
        description: "Connect Purchase",
        metadata: {
            freelancerId: profile.user._id.toString()
        }
    });

    // set new values
    payment.status = "paid";
    payment.amountPaid = session.amount_total! / 100;
    payment.connectionsCount = Number(session.metadata!.connects);
    payment.paidAt = new Date(paymentIntent.created * 1000).toString();
    profile.roles.freelancer!.connects.connectionsCount += Number(session.metadata!.connects);

    await profile.save();


    res.status(StatusCodes.OK).json({ msg: `You have bought ${session.metadata!.connects} connects successfully` });
}


//@desc get high rated freelancers
//@route GET /api/v1/profiles/high-rated
//@access public
const highRatedFrelancers: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { accessToken } = req.signedCookies;
    const userPayload = getUserPayload({ accessToken });

    const category = req.query.category?.toString() as (
        "digital-marketing" |
        "design-creative" |
        "programming-tech" |
        "writing-translation" |
        "video-animation" |
        "finance-accounting" |
        "music-audio" | undefined
    );

    const getCategory = {
        "digital-marketing": "digital marketing",
        "design-creative": "design & creative",
        "programming-tech": "programming & tech",
        "writing-translation": "writing & translation",
        "video-animation": "video & animation",
        "finance-accounting": "finance & accounting",
        "music-audio": "music & audio",
    }

    if (category && !Object.keys(getCategory).includes(category.toString())) {
        throw new BadRequestError("Invalid category");
    }

    const LIMIT = 8;

    const highRatedFreelancers = await Profile.aggregate([
        {
            $match: {
                $and: [
                    { userAs: "freelancer" },
                    category ? { category: getCategory[category] } : {}
                ]
            }
        },
        {
            $addFields: {
                score: {
                    $multiply: [
                        { $divide: ["$rating.numOfReviews", 100] },
                        "$rating.avgRate"
                    ]
                }
            }
        },
        {
            $sort: {
                score: -1,
                createdAt: 1
            }
        },
        {
            $lookup: {
                from: "favourites",
                localField: "_id",
                foreignField: "target",
                as: "favourites"
            }
        },
        {
            $addFields: {
                isFavourite: {
                    $size: {
                        $filter: {
                            input: "$favourites",
                            as: "favourite",
                            cond: {
                                $eq: ["$$favourite.user", new mongoose.Types.ObjectId(userPayload?.userId)]
                            }
                        }
                    }
                }
            }
        },
        {
            $limit: LIMIT
        },
        {
            $project: {
                _id: 1,
                name: 1,
                avatar: 1,
                category: 1,
                country: 1,
                isFavourite: 1,
                "roles.freelancer.skills": 1,
                "roles.freelancer.hourlyRate": 1,
                "roles.freelancer.badge": 1,
                "roles.freelancer.jobTitle": 1,
                "rating.avgRate": 1,
                "rating.numOfReviews": 1,
            }
        }
    ]);

    res.status(StatusCodes.OK).json(highRatedFreelancers);
}


//@desc get all freelancers
//@route GET /api/v1/profiles/freelancers
//@access public
const getAllFreelancers: RequestHandler = async (req, res) => {
    const { accessToken } = req.signedCookies;
    const userPayload = getUserPayload({ accessToken });

    const { badge, rating, country, hourly_rate, category, revenue, english_level, talent_type, search, cursor } = req.query;

    const match: PipelineStage.Match["$match"] = {
        $and: [
            { userAs: "freelancer" }
        ]
    };

    // search by profile badges
    const getBadge = searchFreelancersQueryValidator.isValidBadge(badge);
    if (getBadge) {
        match.$and!.push({
            'roles.freelancer.badge': getBadge
        });
    }

    // search by profile rating
    const getRating = searchFreelancersQueryValidator.isValidRating(rating);
    if (getRating) {
        match.$and!.push({
            "rating.avgRate": { $gte: Number(getRating) }
        });
    }

    // search by country
    const getCountry = searchFreelancersQueryValidator.isValidCountry(country);
    if (getCountry) {
        match.$and!.push({
            country: getCountry
        });
    }

    // search by hourly rate
    const getHourlyRate = searchFreelancersQueryValidator.isValidHourlyRate(hourly_rate);
    if (getHourlyRate) {
        const [minHourlyRate, maxHourlyRate] = getHourlyRate.split(",");
        if (Number(minHourlyRate) <= Number(maxHourlyRate)) {
            match.$and!.push({
                $and: [
                    { "roles.freelancer.hourlyRate": { $gte: Number(minHourlyRate) } },
                    { "roles.freelancer.hourlyRate": { $lte: Number(maxHourlyRate) } },
                ]
            });
        }
    }

    // search by category
    const getCategory = searchFreelancersQueryValidator.isValidCategory(category);
    if (getCategory) {
        match.$and!.push({
            category: getCategory
        });
    }

    // search by english level
    const getEnglishLevel = searchFreelancersQueryValidator.isValidEnglishLevel(english_level);
    if (getEnglishLevel) {
        match.$and!.push({
            "roles.freelancer.englishLevel": getEnglishLevel
        });
    }

    // search by telent type
    const getTalentType = searchFreelancersQueryValidator.isValidTalentType(talent_type);
    if (getTalentType) {
        match.$and!.push({
            "roles.freelancer.types": getTalentType
        });
    }

    // search by search keywords
    const getSearch = searchFreelancersQueryValidator.isValidSearch(search);
    if (getSearch) {
        match.$and!.push({
            $or: [
                { "roles.freelancer.skills": { $in: [getSearch.toLowerCase()] } },
                { "roles.freelancer.skills": { $in: getSearch.toLowerCase().split(" ") } }
            ]
        });
    }

    // sort by ip address
    const ipAddress = req.ip;
    const hash = createHash({ algorithm: "md5", value: ipAddress });
    const bigIntValue = BigInt('0x' + hash);
    const seed = +bigIntValue.toString().slice(0, 12);


    const talentFacetPipeline: PipelineStage.FacetPipelineStage[] = [
        {
            $addFields: {
                sortOrder: {
                    $mod: [
                        { $add: [{ $toLong: { $toDate: "$_id" } }, seed] },
                        100000
                    ]
                }
            }
        },
        {
            $sort: {
                sortOrder: 1
            }
        },
        {
            $lookup: {
                from: "favourites",
                localField: "_id",
                foreignField: "target",
                as: "favourites"
            }
        },
        {
            $addFields: {
                isFavourite: {
                    $size: {
                        $filter: {
                            input: "$favourites",
                            as: "favourite",
                            cond: {
                                $eq: ["$$favourite.user", new mongoose.Types.ObjectId(userPayload?.userId)]
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                status: {
                    $cond: {
                        if: {
                            $eq: ["$connection.isConnected", true]
                        },
                        then: "online",
                        else: {
                            $cond: {
                                if: {
                                    $gt: [
                                        {
                                            $add: [
                                                "$connection.disconnectedAt",
                                                45 * 60 * 1000 // 45min
                                            ]
                                        },
                                        {
                                            $toDate: "$$NOW"
                                        }
                                    ]
                                },
                                then: "idle",
                                else: "offline"
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                avatar: 1,
                description: 1,
                rating: 1,
                country: 1,
                totalRevenue: 1,
                createdAt: 1,
                "roles.freelancer.hourlyRate": 1,
                "roles.freelancer.badge": 1,
                "roles.freelancer.jobTitle": 1,
                "roles.freelancer.englishLevel": 1,
                "roles.freelancer.types": 1,
                "roles.freelancer.skills": 1,
                isFavourite: 1,
                status: 1
            }
        },
    ];


    const cursorFacetPipeline: PipelineStage.FacetPipelineStage[] = [
        {
            $group: {
                _id: null,
                count: {
                    $sum: 1
                }
            }
        }
    ];

    const profileAggregate: PipelineStage[] = [
        {
            $match: match
        },
        {
            $lookup: {
                from: "contracts",
                localField: "_id",
                foreignField: "freelancer.profile",
                as: "contracts"
            }
        },
        {
            $addFields: {
                paidAmounts: {
                    $reduce: {
                        input: {
                            $map: {
                                input: "$contracts",
                                as: "contract",
                                in: {
                                    $filter: {
                                        input: "$$contract.payments",
                                        as: "payment",
                                        cond: { $eq: ["$$payment.freelancer.status", "paid"] }
                                    }
                                }
                            }
                        },
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this"] }
                    },
                }
            }
        },
        {
            $addFields: {
                totalRevenue: {
                    $sum: {
                        $map: {
                            input: "$paidAmounts",
                            as: "paidAmount",
                            in: "$$paidAmount.amount"
                        }
                    }
                }
            }
        },
        {
            $facet: {
                talents: talentFacetPipeline,
                cursor: cursorFacetPipeline
            }
        },
        {
            $addFields: {
                cursor: {
                    $first: "$cursor"
                }
            }
        }
    ];

    // search by revenue
    const getRevenue = searchFreelancersQueryValidator.isValidRevenue(revenue);
    if (getRevenue) {
        const [minRevenue, maxRevenue] = getRevenue.split(",");
        if ((Number(minRevenue) <= Number(maxRevenue)) || maxRevenue === "infinity") {
            const matchRevenue: PipelineStage.Match = {
                $match: {
                    $and: [
                        { totalRevenue: { $gte: Number(minRevenue) } },
                        maxRevenue === "infinity" ? {}
                            : { totalRevenue: { $lte: Number(maxRevenue) } }
                    ]
                }
            };

            talentFacetPipeline.push(matchRevenue);
            cursorFacetPipeline.unshift(matchRevenue);
        }
    }

    // add limits to the profiles
    const isValidCursor = !Number.isNaN(Number(cursor)) && Number.isInteger(Number(cursor));
    const cursorNumber = isValidCursor ? Number(cursor) : 1;
    const LIMIT = 12;
    const SKIP = (cursorNumber - 1) * LIMIT;
    const SIZE_LIMIT = cursorNumber * LIMIT;

    const limitPipeline: PipelineStage.FacetPipelineStage[] = [
        {
            $limit: SIZE_LIMIT
        },
        {
            $skip: SKIP
        }
    ];

    talentFacetPipeline.push(...limitPipeline);


    // get cursor number if still profiles that needs to be fetched otherwise return null
    profileAggregate.push({
        $addFields: {
            cursor: {
                $cond: [
                    { $gt: ["$cursor.count", SIZE_LIMIT] },
                    cursorNumber,
                    null
                ]
            }
        }
    })

    const [freelancersAggregate] = await Profile.aggregate(profileAggregate);

    res.status(StatusCodes.OK).json(freelancersAggregate);
}


//@desc get current user statements
//@route GET /api/v1/profiles/statements
//@access authentication
const getProfileStatements: RequestHandler = async (req: CustomAuthRequest, res) => {

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    const [aggregateStatements] = await Contract.aggregate([
        {
            $match: {
                [`${profile.userAs}.profile`]: profile._id // find only contracts related to this user
            }
        },
        {
            // get user paid payments
            $addFields: {
                paidPayments: {
                    $filter: {
                        input: "$payments",
                        as: "payment",
                        cond: { $eq: [`$$payment.${profile.userAs}.status`, "paid"] }
                    }
                }
            }
        },
        {
            // get one month payments
            $addFields: {
                oneMonthPayments: {
                    $reduce: {
                        input: {
                            $filter: {
                                input: "$paidPayments",
                                as: "payment",
                                cond: { $gte: [`$$payment.${profile.userAs}.at`, (new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))] }
                            },
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this.amount"]
                        }
                    }
                }
            }
        },
        {
            // get one year payments
            $addFields: {
                oneYearPayments: {
                    $reduce: {
                        input: {
                            $filter: {
                                input: "$paidPayments",
                                as: "payment",
                                cond: { $gte: [`$$payment.${profile.userAs}.at`, (new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))] }
                            },
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this.amount"]
                        }
                    }
                }
            }
        },
        {
            // get overall total
            $addFields: {
                total: {
                    $reduce: {
                        input: "$paidPayments",
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this.amount"]
                        }
                    }
                }
            }
        },
        {
            // get pending payments
            $addFields: {
                pendingPayments: {
                    $reduce: {
                        input: {
                            $filter: {
                                input: "$payments",
                                as: "payment",
                                cond: { $eq: [`$$payment.${profile.userAs}.status`, "pending"] }
                            }
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this.amount"]
                        }
                    }
                }
            }
        },
        {
            // get user payments that are pending, paid or refunded 
            $addFields: {
                allPayments: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$payments",
                                as: "payment",
                                cond: {
                                    $or: [
                                        { $eq: [`$$payment.${profile.userAs}.status`, "pending"] },
                                        { $eq: [`$$payment.${profile.userAs}.status`, "paid"] },
                                        { $eq: [`$$payment.${profile.userAs}.status`, "refunded"] }
                                    ]
                                }
                            }
                        },
                        as: "payment",
                        in: {
                            _id: "$$payment._id",
                            activityType: "$activityType",
                            projectType: { $cond: ["$job.priceType", "$job.priceType", "fixed"] },
                            amount: "$$payment.amount",
                            employer: "$$payment.employer",
                            freelancer: "$$payment.freelancer"
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: `$${profile.userAs}.profile`,
                allPayments: {
                    $push: "$allPayments" // push all payments to one array
                },
                oneMonthPayments: {
                    $sum: "$oneMonthPayments"
                },
                oneYearPayments: {
                    $sum: "$oneYearPayments"
                },
                total: {
                    $sum: "$total"
                },
                pendingPayments: {
                    $sum: "$pendingPayments"
                },
            }
        },
        {
            // remove duplicate arrays
            $addFields: {
                payments: {
                    $reduce: {
                        input: "$allPayments",
                        initialValue: [],
                        in: {
                            $concatArrays: ["$$value", "$$this"]
                        }
                    }
                }
            }
        },
        {
            $project: {
                allPayments: 0,
                "payments.employer.refundRequest": 0,
                "payments.freelancer.net": 0
            }
        }
    ]);

    // if the user have no contracts yet then return default values
    const noResults = {
        _id: "",
        oneMonthPayments: 0,
        oneYearPayments: 0,
        total: 0,
        pendingPayments: 0,
        payments: []
    }

    res.status(StatusCodes.OK).json(aggregateStatements || noResults);
}


//@desc get current freelancer reports for the dashboard
//@route GET /api/v1/profiles/freelancers/reports
//@access authentication (freelancers only)
const getFreelancerReports: RequestHandler = async (req: CustomAuthRequest, res) => {
    const [aggregateReports] = await Profile.aggregate([
        {
            // find current freelancer
            $match: {
                user: new mongoose.Types.ObjectId(req.user!.userId),
                userAs: "freelancer"
            }
        },
        {
            $lookup: {
                from: "services",
                foreignField: "profile",
                localField: "_id",
                as: "services"
            }
        },
        {
            // get the total of freelancer's services
            $addFields: {
                postedServices: {
                    $size: "$services"
                }
            }
        },
        {
            $lookup: {
                from: "contracts",
                foreignField: "freelancer.profile",
                localField: "_id",
                as: "contracts"
            }
        },
        {
            // get completed contract services
            $addFields: {
                completedServices: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $and: [
                                { $eq: ["$$contract.activityType", "service"] },
                                { $eq: ["$$contract.freelancer.status", "completed"] },
                                { $eq: ["$$contract.employer.status", "completed"] }
                            ]
                        }
                    }
                }
            }
        },
        {
            // get total revenue made from services
            $addFields: {
                servicesRevenue: {
                    $reduce: {
                        input: {
                            $map: {
                                input: "$completedServices",
                                as: "service",
                                in: {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: "$$service.payments",
                                                as: "payment",
                                                cond: { $eq: ["$$payment.freelancer.status", "paid"] }
                                            }
                                        },
                                        initialValue: 0,
                                        in: {
                                            $add: ["$$value", "$$this.amount"]
                                        }
                                    }
                                }
                            }
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this"]
                        }
                    }
                }
            }
        },
        {
            // get the total of completed services
            $addFields: {
                totalOfCompletedServices: {
                    $size: "$completedServices"
                }
            }
        },
        {
            // get the total of in progress services
            $addFields: {
                inQueueServices: {
                    $size: {
                        $filter: {
                            input: "$contracts",
                            as: "contract",
                            cond: {
                                $and: [
                                    {
                                        $eq: ["$$contract.activityType", "service"]
                                    },
                                    {
                                        $or: [
                                            { $eq: ["$$contract.freelancer.status", "inProgress"] },
                                            { $eq: ["$$contract.employer.status", "inProgress"] }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            // get job contracts
            $addFields: {
                jobContracts: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $eq: ["$$contract.activityType", "job"],
                        }
                    }
                }
            }
        },
        {
            // get completed job contracts
            $addFields: {
                completedJobContracts: {
                    $filter: {
                        input: "$jobContracts",
                        as: "contract",
                        cond: {
                            $and: [
                                { $eq: ["$$contract.freelancer.status", "completed"] },
                                { $eq: ["$$contract.employer.status", "completed"] }
                            ]
                        }
                    }
                }
            }
        },
        {
            // get total of completed jobs
            $addFields: {
                totalOfCompletedJobs: {
                    $size: "$completedJobContracts"
                }
            }
        },
        {
            // get total of in progress jobs
            $addFields: {
                inQueueJobs: {
                    $size: {
                        $filter: {
                            input: "$jobContracts",
                            as: "contract",
                            cond: {
                                $or: [
                                    { $eq: ["$$contract.freelancer.status", "inProgress"] },
                                    { $eq: ["$$contract.employer.status", "inProgress"] }
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            // get total revenue made from jobs
            $addFields: {
                jobsRevenue: {
                    $reduce: {
                        input: {
                            $map: {
                                input: "$jobContracts",
                                as: "jobContract",
                                in: {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: "$$jobContract.payments",
                                                as: "payment",
                                                cond: {
                                                    $eq: ["$$payment.freelancer.status", "paid"]
                                                }
                                            }
                                        },
                                        initialValue: 0,
                                        in: {
                                            $add: ["$$value", "$$this.amount"]
                                        }
                                    }
                                }
                            }
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this"]
                        }
                    }
                }
            }
        },
        {
            $lookup: {
                from: "proposals",
                foreignField: "profile",
                localField: "_id",
                as: "proposals"
            }
        },
        {
            // get the total of approved proposals
            $addFields: {
                approvedProposals: {
                    $size: {
                        $filter: {
                            input: "$proposals",
                            as: "proposal",
                            cond: {
                                $eq: ["$$proposal.status", "approved"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get the total of interviewing proposals
            $addFields: {
                interviewingProposals: {
                    $size: {
                        $filter: {
                            input: "$proposals",
                            as: "proposal",
                            cond: {
                                $eq: ["$$proposal.status", "interviewing"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get the total of rejected proposals
            $addFields: {
                rejectedProposals: {
                    $size: {
                        $filter: {
                            input: "$proposals",
                            as: "proposal",
                            cond: {
                                $eq: ["$$proposal.status", "rejected"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get the total spent to boost proposals
            $addFields: {
                connectsSpendToBoostProposals: {
                    $reduce: {
                        input: "$proposals",
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this.boostProposal.spentConnects"]
                        }
                    }
                }
            }
        },
        {
            $lookup: {
                from: "jobs",
                foreignField: "_id",
                localField: "proposals.job",
                as: "jobs"
            }
        },
        {
            // calc the total connects that has been spent on proposals
            $addFields: {
                connectsSpentOnProposals: {
                    $reduce: {
                        input: "$jobs",
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this.connects"]
                        }
                    }
                }
            }
        },
        {
            // get the total amount spent on proposals
            $addFields: {
                totalSpentOnConnects: {
                    $reduce: {
                        input: {
                            $filter: {
                                input: "$roles.freelancer.connects.payments",
                                as: "payment",
                                cond: {
                                    $eq: ["$$payment.status", "paid"]
                                }
                            }
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this.amountPaid"]
                        }
                    }
                }
            }
        },
        {
            $project: {
                profile: {
                    name: "$name",
                    avatar: "$avatar",
                    rating: "$rating",
                    badge: "$roles.freelancer.badge"
                },
                service: {
                    postedServices: "$postedServices",
                    completedServices: "$totalOfCompletedServices",
                    inQueueServices: "$inQueueServices",
                    servicesRevenue: "$servicesRevenue"
                },
                job: {
                    completedJobs: "$totalOfCompletedJobs",
                    inQueueJobs: "$inQueueJobs",
                    jobsRevenue: "$jobsRevenue"
                },
                proposal: {
                    approvedProposals: "$approvedProposals",
                    interviewingProposals: "$interviewingProposals",
                    rejectedProposals: "$rejectedProposals",
                },
                connect: {
                    connectsSpentOnProposals: "$connectsSpentOnProposals",
                    connectsSpendToBoostProposals: "$connectsSpendToBoostProposals",
                    totalSpentOnConnects: "$totalSpentOnConnects"
                }
            }
        }
    ]);

    // if the user is not a freelancer or has been deleted
    if (!aggregateReports) {
        throw new UnauthorizedError("Found no freelancer");
    }

    res.status(StatusCodes.OK).json(aggregateReports);
}



const getEmployersReports: RequestHandler = async (req: CustomAuthRequest, res) => {
    const [aggregateReports] = await Profile.aggregate([
        {
            // find current employer
            $match: {
                $and: [
                    { user: new mongoose.Types.ObjectId(req.user!.userId) },
                    { userAs: "employer" }
                ]
            }
        },
        {
            $lookup: {
                from: "jobs",
                foreignField: "profile",
                localField: "_id",
                as: "jobs"
            }
        },
        {
            // get how many jobs are posted by this employer
            $addFields: {
                postedJobs: {
                    $size: "$jobs"
                }
            }
        },
        {
            $lookup: {
                from: "contracts",
                foreignField: "employer.profile",
                localField: "_id",
                as: "contracts"
            }
        },
        {
            // get in progress contracts
            $addFields: {
                inProgressContracts: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $or: [
                                { $eq: ["$$contract.freelancer.status", "inProgress"] },
                                { $eq: ["$$contract.employer.status", "inProgress"] }
                            ]
                        }
                    }
                }
            }
        },
        {
            // get completed contracts
            $addFields: {
                completedContracts: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $and: [
                                { $eq: ["$$contract.freelancer.status", "completed"] },
                                { $eq: ["$$contract.employer.status", "completed"] }
                            ]
                        }
                    }
                }
            }
        },
        {
            // get how many in progress job contracts
            $addFields: {
                inProgressJobs: {
                    $size: {
                        $filter: {
                            input: "$inProgressContracts",
                            as: "inProgressContract",
                            cond: {
                                $eq: ["$$inProgressContract.activityType", "job"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get how many completed job contracts
            $addFields: {
                completedJobs: {
                    $size: {
                        $filter: {
                            input: "$completedContracts",
                            as: "completedContract",
                            cond: {
                                $eq: ["$$completedContract.activityType", "job"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get how many in progress service contracts
            $addFields: {
                inProgressServices: {
                    $size: {
                        $filter: {
                            input: "$inProgressContracts",
                            as: "inProgressContract",
                            cond: {
                                $eq: ["$$inProgressContract.activityType", "service"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get how many completed service contracts
            $addFields: {
                completedServices: {
                    $size: {
                        $filter: {
                            input: "$completedContracts",
                            as: "completedContract",
                            cond: {
                                $eq: ["$$completedContract.activityType", "service"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get how many bought services
            $addFields: {
                boughtServices: {
                    $size: {
                        $filter: {
                            input: "$contracts",
                            as: "contract",
                            cond: {
                                $eq: ["$$contract.activityType", "service"]
                            }
                        }
                    }
                }
            }
        },
        {
            $lookup: {
                from: "proposals",
                foreignField: "job",
                localField: "jobs._id",
                as: "proposals"
            }
        },
        {
            // get how many pending proposals
            $addFields: {
                pendingProposals: {
                    $size: {
                        $filter: {
                            input: "$proposals",
                            as: "proposal",
                            cond: {
                                $eq: ["$$proposal.status", "pending"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get how many approved proposals
            $addFields: {
                hiredProposals: {
                    $size: {
                        $filter: {
                            input: "$proposals",
                            as: "proposal",
                            cond: {
                                $eq: ["$$proposal.status", "approved"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get how many interviewing proposals
            $addFields: {
                interviewingProposals: {
                    $size: {
                        $filter: {
                            input: "$proposals",
                            as: "proposal",
                            cond: {
                                $eq: ["$$proposal.status", "interviewing"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get how many rejected proposals
            $addFields: {
                rejectedProposals: {
                    $size: {
                        $filter: {
                            input: "$proposals",
                            as: "proposal",
                            cond: {
                                $eq: ["$$proposal.status", "rejected"]
                            }
                        }
                    }
                }
            }
        },
        {
            // get job contracts
            $addFields: {
                jobContracts: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $eq: ["$$contract.activityType", "job"]
                        }
                    }
                }
            }
        },
        {
            // get the total spent on jobs
            $addFields: {
                spentOnJobs: {
                    $reduce: {
                        input: {
                            $map: {
                                input: "$jobContracts",
                                as: "jobContract",
                                in: {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: "$$jobContract.payments",
                                                as: "payment",
                                                cond: {
                                                    $eq: ["$$payment.employer.status", "paid"]
                                                }
                                            }
                                        },
                                        initialValue: 0,
                                        in: {
                                            $add: ["$$value", "$$this.amount"]
                                        }
                                    }
                                }
                            }
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this"]
                        }
                    },
                }
            }
        },
        {
            // get service contracts
            $addFields: {
                serviceContracts: {
                    $filter: {
                        input: "$contracts",
                        as: "contract",
                        cond: {
                            $eq: ["$$contract.activityType", "service"]
                        }
                    }
                }
            }
        },
        {
            // get the total spent on services
            $addFields: {
                spentOnServices: {
                    $reduce: {
                        input: {
                            $map: {
                                input: "$serviceContracts",
                                as: "serviceContract",
                                in: {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: "$$serviceContract.payments",
                                                as: "payment",
                                                cond: {
                                                    $eq: ["$$payment.employer.status", "paid"]
                                                }
                                            }
                                        },
                                        initialValue: 0,
                                        in: {
                                            $add: ["$$value", "$$this.amount"]
                                        }
                                    }
                                }
                            }
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this"]
                        }
                    },
                }
            }
        },
        {
            // get the total has been refunded
            $addFields: {
                refunded: {
                    $reduce: {
                        input: {
                            $map: {
                                input: "$contracts",
                                as: "contract",
                                in: {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: "$$contract.payments",
                                                as: "payment",
                                                cond: {
                                                    $eq: ["$$payment.employer.status", "refunded"]
                                                }
                                            }
                                        },
                                        initialValue: 0,
                                        in: {
                                            $add: ["$$value", "$$this.amount"]
                                        }
                                    }
                                }
                            }
                        },
                        initialValue: 0,
                        in: {
                            $add: ["$$value", "$$this"]
                        }
                    },
                }
            }
        },
        {
            $project: {
                profile: {
                    name: "$name",
                    avatar: "$avatar",
                    rating: "$rating"
                },
                job: {
                    postedJobs: "$postedJobs",
                    inProgressJobs: "$inProgressJobs",
                    completedJobs: "$completedJobs"
                },
                service: {
                    boughtServices: "$boughtServices",
                    inProgressServices: "$inProgressServices",
                    completedServices: "$completedServices"
                },
                proposal: {
                    pendingProposals: "$pendingProposals",
                    hiredProposals: "$hiredProposals",
                    interviewingProposals: "$interviewingProposals",
                    rejectedProposals: "$rejectedProposals"
                },
                totalSpent: {
                    spentOnJobs: "$spentOnJobs",
                    spentOnServices: "$spentOnServices",
                    refunded: "$refunded"
                }
            }
        }
    ]);

    // if the user is not a freelancer or has been deleted
    if (!aggregateReports) {
        throw new UnauthorizedError("Found no employer");
    }

    res.status(StatusCodes.OK).json(aggregateReports)
}

export {
    profileInfo,
    singleProfile,
    uploadAvatar,
    updateProfile,
    deleteProfile,
    deleteSingleProfile,
    buyConnects,
    setPaidConnects,
    highRatedFrelancers,
    getAllFreelancers,
    getProfileStatements,
    getFreelancerReports,
    getEmployersReports
}