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
import { contractModel as Contract, contractModel } from "../contract";
import { jobModel as Job, JobType } from "../job";
import mongoose, { PipelineStage } from "mongoose";
import "./badge_upgrade/upgrades";
import searchFreelancersQueryValidator from "./validators/searchQueriesValidator";
import createHash from "../../utils/createHash";

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
    const profile = await Profile.findById(profileId).select("-roles.freelancer.connects -updatedAt");
    if (!profile) {
        throw new NotFoundError("Found no profile");
    }

    const profileInfo = getProfileInfo(profile.toObject());

    let profileData: ProfileData = {
        ...profileInfo
    }

    if (profileData.userAs === "freelancer") {
        const services = await Service.find({ user: profile.user._id, profile: profile._id }).select("_id featuredImage title category tier.starter.price").populate({ path: "profile", select: "_id name avatar" }).lean();

        const projectSuccess = await Contract.count({
            "freelancer.user": profile.user._id,
            "freelancer.profile": profile._id,
            activityType: "job",
            $and: [{ "freelancer.status": "completed" }, { "employer.status": "completed" }]
        });

        const completedService = await Contract.count({
            "freelancer.user": profile.user._id,
            "freelancer.profile": profile._id,
            activityType: "service",
            $and: [{ "freelancer.status": "completed" }, { "employer.status": "completed" }]
        });

        const inQueueService = await Contract.count({
            "freelancer.user": profile.user._id,
            "freelancer.profile": profile._id,
            activityType: "service",
            $or: [{ "freelancer.status": "inProgress" }, { "employer.status": "inProgress" }]
        });

        profileData = {
            ...profileData,
            projectSuccess,
            totalService: services.length,
            completedService,
            inQueueService,
            services
        }
    }

    if (profileData.userAs === "employer") {
        const openJobs = await Job.find({ user: profile.user._id, profile: profile._id, status: "open" }).select("_id title category priceType price locationType createdAt profile").populate({ path: "profile", select: "name country" }).lean();
        profileData = {
            ...profileData,
            openJobs
        }
    }

    res.status(StatusCodes.OK).json(profileData);
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


    // switch roles between freelancer and employer
    const isSwitichingRole: { userAs: IProfile["userAs"] } | undefined = req.body.switchRole;
    if (isSwitichingRole && isSwitichingRole.userAs && (isSwitichingRole.userAs === "employer" || isSwitichingRole.userAs === "freelancer")) {
        await profile.updateOne({ userAs: isSwitichingRole.userAs });
        return res.status(StatusCodes.OK).json({ msg: `Profile now is ${isSwitichingRole.userAs}` });
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

    // delete profile
    await profile.deleteOne();

    // destroy auth cookie
    destroyCookie(res);

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
        success_url: `http://localhost:5000/api/v1/profiles/connects?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:5173",
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

    res.redirect(session.url!);
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
            $limit: LIMIT
        },
        {
            $project: {
                _id: 1,
                name: 1,
                avatar: 1,
                category: 1,
                country: 1,
                "roles.freelancer.skills": 1,
                "roles.freelancer.hourlyRate": 1,
                "rating.avgRate": 1,
                "rating.numOfReviews": 1
            }
        }
    ]);

    res.status(StatusCodes.OK).json(highRatedFreelancers);
}


//@desc get all freelancers
//@route GET /api/v1/profiles/freelancers
//@access public
const getAllFreelancers: RequestHandler = async (req, res) => {
    const { badge, rating, country, hourly_rate, category, revenue, english_level, talent_type, search } = req.query;

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
        console.log(getTalentType);

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

    // check if valid revenue value
    const getRevenue = searchFreelancersQueryValidator.isValidRevenue(revenue);

    // sort by ip address
    const ipAddress = req.ip;
    const hash = createHash({ algorithm: "md5", value: ipAddress });
    const bigIntValue = BigInt('0x' + hash);
    const seed = +bigIntValue.toString().slice(0, 12);

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
                "roles.freelancer.skills": 1
            }
        },
    ];

    // search by revenue
    if (getRevenue) {
        const [minRevenue, maxRevenue] = getRevenue.split(",");
        if ((Number(minRevenue) <= Number(maxRevenue)) || maxRevenue === "infinity") {
            profileAggregate.push({
                $match: {
                    $and: [
                        { totalRevenue: { $gte: Number(minRevenue) } },
                        maxRevenue === "infinity" ? {}
                            : { totalRevenue: { $lte: Number(maxRevenue) } }
                    ]
                }
            });
        }
    }

    const freelancersAggregate = await Profile.aggregate(profileAggregate);

    res.status(StatusCodes.OK).json(freelancersAggregate);
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
    getAllFreelancers
}