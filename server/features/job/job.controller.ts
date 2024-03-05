import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { User } from "../auth";
import createJobValidator from "./validators/createJobValidator";
import userAsPermission from "../../helpers/userAsOnly";
import Job, { JobType } from "./job.model";
import getUpdatedJobInfo from "./helpers/getUpdatedJobInfo";
import rolePermissionChecker from "../../utils/rolePermissionChecker";
import getFixedPriceJobAfterFees from "./utils/getFixedPriceJobAfterFees";
import sendCreatedJobEmail from "./services/sendCreatedJobEmail";
import jobFees from "./job.fees";
import generateJobConnects from "./utils/generateJobConnects";
import { contractModel as Contract } from "../contract";
import { Profile } from "../profile";
import { proposalModel as Proposal } from "../proposal";
import getUserPayload from "../../utils/getUserPayload";
import mongoose from "mongoose";

type JobAggregateData = {
    proposals: {
        _id: null;
        total: number;
    }[];
    interviewing: {
        _id: null;
        total: number;
    }[];
    approved: {
        _id: null;
        total: number;
    }[];
    rejected: {
        _id: null;
        total: number;
    }[];
    hasSubmitted: {
        _id: null;
        count: number;
    }[];
}

type ProfileAggregateData = {
    totalSpentData: {
        _id: null;
        totalSpent: number;
    }[];
    avgHourlyRateData: {
        _id: null;
        avgWorkedHours: number;
        avgAmount: number;
        avgHourlyRatePaid: number;
    }[]
}

//@desc get all jobs info
//@route GET /api/v1/jobs
//@access public
const getAllJobs: RequestHandler = async (req, res) => {
    const {
        project_type: priceType,
        project_price: price,
        project_length: duration,
        hours_per_week: weeklyHours,
        location_type: locationType,
        experience_level: experienceLevel,
        category,
        search,
        page
    } = req.query;

    const searchQuery: Partial<{ $and: {}[], $or: {}[] }> = {};

    // search by tags & title
    const isValidSearch = search && search.toString().trim() !== "";
    if (isValidSearch) {
        if (!searchQuery.$or) searchQuery.$or = [];
        const regex = new RegExp(`^${search.toString()}`);

        // search by tags
        searchQuery.$or.push({ tags: { $in: [regex] } });

        // search by title
        searchQuery.$or.push({ title: { $regex: search.toString(), $options: "i" } });
    }

    // search by project type (hourly or fixed)
    const priceTypeList = ["hourly", "fixed"];
    const isValidPriceType = priceType && priceType.toString().trim() !== "" && priceTypeList.includes(priceType.toString());
    if (isValidPriceType) {
        if (!searchQuery.$and) searchQuery.$and = [];
        searchQuery.$and.push({ priceType: priceType.toString() });
    }

    // search by prokect price
    const isValidPrice = price && price.toString().trim() !== "" && /^\d+-\d+$/.test(price.toString());
    if (isValidPrice) {
        const [minPrice, maxPrice] = price.toString().split("-");
        if (Number(minPrice) <= Number(maxPrice)) {
            if (!searchQuery.$and) searchQuery.$and = [];
            searchQuery.$and.push({ "price.min": { $gte: minPrice }, "price.max": { $lte: maxPrice } });
        }

    }

    // search by project length (duration)
    const isValidDuration = duration && duration.toString().trim() !== "" && /^[a-zA-Z]+\s*(<|>)\s*\d+$/.test(duration.toString());
    if (isValidDuration) {
        const dateTypeList = ["hours", "days", "months"];

        const getComparisonOperator = duration.toString().includes("<") ? "<" : ">";
        const [dateType, value] = duration.toString().split(getComparisonOperator);

        if (dateTypeList.includes(dateType)) {
            const operator = getComparisonOperator === "<" ? "$lte" : "$gte";
            if (!searchQuery.$and) searchQuery.$and = [];
            searchQuery.$and.push({ "duration.dateType": dateType }, { "duration.dateValue": { [operator]: Number(value) } });
        }
    }

    // search by hours per week (weekly hours)
    const isValidWeeklyHours = weeklyHours && weeklyHours.toString().trim() !== "" && /^\d+-\d+$/.test(weeklyHours.toString());
    if (isValidWeeklyHours) {
        const [min, max] = weeklyHours.toString().split("-");
        if (Number(min) <= Number(max)) {
            if (!searchQuery.$and) searchQuery.$and = [];
            searchQuery.$and.push({ "weeklyHours.min": { $gte: min }, "weeklyHours.max": { $lte: max } });
        }
    }

    // search by location type
    const locationTypeList = ["remote", "onsite"];
    const isValidLocationType = locationType && locationType.toString().trim() !== "" && locationTypeList.includes(locationType.toString());
    if (isValidLocationType) {
        if (!searchQuery.$and) searchQuery.$and = [];
        searchQuery.$and.push({ locationType: locationType.toString() });
    }

    // search by experience level
    const experienceLevelList = ["entry-level", "intermediate", "expert"];
    const isValidExperienceLevel = experienceLevel && experienceLevel.toString().trim() !== "" && experienceLevelList.includes(experienceLevel.toString());
    if (isValidExperienceLevel) {
        const formatedExperienceLevel = experienceLevel.toString() === "entry-level" ? "entryLevel" : experienceLevel.toString();
        if (!searchQuery.$and) searchQuery.$and = [];
        searchQuery.$and.push({ experienceLevel: formatedExperienceLevel });
    }

    // search by category
    const categoryList = ["digital-marketing", "design-creative", "programming-tech", "writing-translation", "video-animation", "finance-accounting", "music-audio"];
    const isValidCategory = category && category.toString().trim() !== "" && categoryList.includes(category.toString());
    if (isValidCategory) {
        const formatedCategory = category === "digital-marketing" ? category.toString().split("-").join(" ") : category.toString().split("-").join(" & ");
        if (!searchQuery.$and) searchQuery.$and = [];
        searchQuery.$and.push({ category: formatedCategory });
    }

    // add skip and limit
    const currentPage = page && page.toString() !== "" && /^\d+$/.test(page.toString()) && Number(page.toString()) > 0 ? Number(page.toString()) : 1;
    const limit = 8;
    const end = currentPage * limit;
    const start = (currentPage - 1) * limit;

    // find jobs
    const jobs = await Job.find(searchQuery).select("title description priceType price experienceLevel createdAt tags duration weeklyHours").sort("-createdAt");

    // filter for only employers
    const numOfPages = Math.ceil(jobs.length / limit);

    if (currentPage > numOfPages) {
        throw new NotFoundError("Couldn't find any results in this page");
    }

    res.status(StatusCodes.OK).json({ numOfPages, jobs: jobs.slice(start, end) });
}


//@desc get single job info
//@route GET /api/v1/jobs/:jobId
//@access public
const singleJob: RequestHandler = async (req, res) => {
    const { jobId } = req.params;
    if (!jobId || jobId.trim() === "") {
        throw new BadRequestError("Must provide the job id");
    }

    // find the job
    const job = await Job.findById(jobId).populate({ path: "profile", select: "name userAs country category roles.employer.employees roles.employer.totalJobPosted createdAt" }).lean();
    if (!job) {
        throw new NotFoundError(`Found no job with id ${jobId}`);
    }

    // check if the uesr an employer
    if (job.profile.userAs !== "employer") {
        throw new UnauthorizedError(`${job.profile.name} is no longer an employer`);
    }

    // calc average hourly rate paid and total spent by the employer
    const [data]: ProfileAggregateData[] = await Contract.aggregate([
        {
            $unwind: "$payments"
        },
        {
            $match: {
                $and: [
                    { activityType: "job" },
                    { "employer.user": job.user._id },
                    { "payments.employer.status": "paid" }
                ]
            }
        },
        {
            $facet: {
                totalSpentData: [
                    {
                        $group: {
                            _id: null,
                            totalSpent: {
                                $sum: "$payments.amount"
                            }
                        }
                    }
                ],
                avgHourlyRateData: [
                    {
                        $match: {
                            $and: [
                                { "job.priceType": "hourly" },
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            avgWorkedHours: {
                                $avg: "$payments.workedHours"
                            },
                            avgAmount: {
                                $avg: "$payments.amount"
                            }
                        }
                    },
                    {
                        $addFields: {
                            avgHourlyRatePaid: {
                                $cond: [
                                    { $eq: ["$avgWorkedHours", 0] },
                                    0,
                                    { $divide: ["$avgAmount", "$avgWorkedHours"] }
                                ]
                            }
                        }
                    }
                ]
            }
        }
    ]);

    // is freelancer logged in to return if has submitted proposal to this job or not
    const { accessToken } = req.signedCookies;
    const user = getUserPayload({
        accessToken: accessToken || ""
    });

    // get activity on this job
    const [jobActivity]: JobAggregateData[] = await Proposal.aggregate([
        {
            $match: {
                $and: [
                    { job: job._id }
                ]
            }
        },
        {
            $facet: {
                proposals: [
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: 1
                            }
                        }
                    }
                ],
                interviewing: [
                    {
                        $match: {
                            $and: [
                                { status: "interviewing" }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: 1
                            }
                        }
                    }
                ],
                approved: [
                    {
                        $match: {
                            $and: [
                                { status: "approved" }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: 1
                            }
                        }
                    }
                ],
                rejected: [
                    {
                        $match: {
                            $and: [
                                { status: "rejected" }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: 1
                            }
                        }
                    }
                ],
                hasSubmitted: [
                    {
                        $match: {
                            user: new mongoose.Types.ObjectId(user?.userId)
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ]
            }
        }
    ]);

    // get all job details
    const jobDetails = {
        ...job,
        hasSubmitted: jobActivity.hasSubmitted.length ? true : false,
        profile: {
            ...job.profile,
            roles: undefined,
            totalJobPosted: job.profile.roles?.employer?.totalJobPosted || 0,
            totalSpentOnJobs: data.totalSpentData[0]?.totalSpent || 0,
            avgHourlyRatePaid: data.avgHourlyRateData[0]?.avgHourlyRatePaid || 0
        },
        activity: {
            totalProposals: jobActivity?.proposals[0]?.total || 0,
            interviewing: jobActivity?.interviewing[0]?.total || 0,
            approved: jobActivity?.approved[0]?.total || 0,
            rejected: jobActivity?.rejected[0]?.total || 0
        }
    }

    res.status(StatusCodes.OK).json(jobDetails);
}


//@desc create a new job
//@route POST /api/v1/jobs
//@access authentication (employers only)
const createJob: RequestHandler = async (req: CustomAuthRequest, res) => {
    const inputs = req.body;

    // check if valid inputs
    createJobValidator(inputs);

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "email" });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is a employer
    userAsPermission({
        permissionedRole: "employer",
        currentUserRole: profile.userAs
    });

    // generate job connects
    const jobConnects = inputs.priceType === "fixed" ?
        generateJobConnects.fixedPriceJob({
            jobPrice: inputs.price.min // for fixed price job min and max are the same value
        }) : generateJobConnects.hourlyPriceJob({
            price: inputs.price,
            jobDuration: inputs.duration
        });

    // get all job info
    const jobInfo: JobType = {
        user: Object(profile.user._id),
        profile: profile!._id,
        title: inputs.title,
        description: inputs.description,
        category: inputs.category,
        priceType: inputs.priceType,
        price: inputs.price,
        locationType: inputs.locationType,
        duration: inputs.duration,
        weeklyHours: inputs.weeklyHours,
        experienceLevel: inputs.experienceLevel,
        tags: inputs.tags,
        connects: jobConnects,
        status: "open"
    }

    if (jobInfo.priceType === "fixed") {
        const { feeAmount, feeType } = getFixedPriceJobAfterFees({
            contractPrice: jobInfo.price.min, // min and max are the same values for fixed price
            userAs: "employer"
        });

        // initial strip validation
        const stripeValidation = true;
        if (!stripeValidation) {
            throw new BadRequestError("Invalid payment");
        }

        // send created fixed price job email
        sendCreatedJobEmail.fixedPrice({
            email: profile.user.email!.toString(),
            jobTitle: jobInfo.title,
            feeAmount,
            feeType
        });
    } else {
        // send created hourly price job email
        sendCreatedJobEmail.hourlyPrice({
            email: profile.user.email!.toString(),
            jobTitle: jobInfo.title,
            feeAmount: jobFees.creatingJobFees.amount,
            feeType: jobFees.creatingJobFees.type
        });
    }

    // create job
    await Job.create(jobInfo);

    // increase employer total job posted
    profile.roles.employer!.totalJobPosted++;
    await profile.save()

    res.status(StatusCodes.CREATED).json({ msg: "You have created a job successfully" });
}


//@desc update job
//@route GET /api/v1/jobs/:jobId
//@access authentication
const updateJob: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { jobId } = req.params;
    if (!jobId || jobId.trim() === "") {
        throw new BadRequestError("Must provide job id");
    }

    // find job
    const job = await Job.findById(jobId);
    if (!job) {
        throw new NotFoundError(`Found no job with id ${jobId}`);
    }

    // check if belongs to the current user
    if (job.user._id.toString() !== req.user!.userId) {
        throw new UnauthorizedError("You dont have access to update this job");
    }


    const inputs = req.body;
    // get the updated valid job info
    const updatedJobInfo = getUpdatedJobInfo({
        inputs,
        jobPriceType: job.priceType
    });

    // update the job
    await job.updateOne(updatedJobInfo);

    res.status(StatusCodes.OK).json({ msg: "You have updated the job successfully" });
}


//@desc delete job
//@route GET /api/v1/jobs/:jobId
//@access authentication
const deleteJob: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { jobId } = req.params;
    if (!jobId || jobId.trim() === "") {
        throw new BadRequestError("Must provide job id");
    }

    // find the job
    const job = await Job.findById(jobId);
    if (!job) {
        throw new NotFoundError(`Found no job with id ${jobId}`);
    }

    // find the current user
    const currentUser = await User.findById(req.user!.userId);
    if (!currentUser) {
        throw new UnauthenticatedError("Found no user");
    }


    const hasValidRole = rolePermissionChecker({
        allowedRoles: ["admin", "owner"],
        currentRole: currentUser.role
    });

    // check if the current user is an admin or owner
    if (hasValidRole) {
        if (currentUser.role !== "owner") {
            // create data analytics later for the owner dashboard
        }
        await job.deleteOne();
        return res.status(StatusCodes.OK).json({ msg: `You have deleted job with id ${jobId}` });
    }


    // check if the job belong to the current user
    if (currentUser._id.toString() !== job.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to delete this job");
    }

    // delete the job
    await job.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Your job has been deleted" });
}


//@desc get employer's jobs
//@route GET /api/v1/jobs/profile/employer-jobs
//@access authentication (employers only)
const getEmployerJobs: RequestHandler = async (req: CustomAuthRequest, res) => {
    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is an employer
    if (profile.userAs !== "employer") {
        throw new UnauthorizedError("Only employers have access to their jobs");
    }

    const aggregateJobs = await Job.aggregate([
        {
            $match: {
                profile: profile._id // get jobs related to this employer
            }
        },
        {
            // get proposals related to the job
            $lookup: {
                from: "proposals",
                foreignField: "job",
                localField: "_id",
                as: "proposals"
            }
        },
        {
            $group: {
                _id: "$_id",
                title: {
                    $first: "$title"
                },
                status: {
                    $first: "$status"
                },
                priceType: {
                    $first: "$priceType"
                },
                price: {
                    $first: "$price"
                },
                experienceLevel: {
                    $first: "$experienceLevel"
                },
                createdAt: {
                    $first: "$createdAt"
                },
                proposals: {
                    $sum: {
                        $size: "$proposals" // calc the amount of proposals has been submitted
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1 // sort by newest jobs
            }
        }
    ]);

    res.status(StatusCodes.OK).json(aggregateJobs);
}


export {
    getAllJobs,
    singleJob,
    createJob,
    updateJob,
    deleteJob,
    getEmployerJobs
}