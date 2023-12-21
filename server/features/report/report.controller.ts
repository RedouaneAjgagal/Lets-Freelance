import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../../errors";
import Report, { ReportType } from "./report.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createReportValidator from "./validators/createReportValidator";
import { User } from "../auth";
import { Profile } from "../profile";
import { serviceModel as Service } from "../service";
import { jobModel as Job } from "../job";
import mongoose from "mongoose";
import { isInvalidDuration, isInvalidEvent, isInvalidSorting } from "./validators/inputValidations";


//@desc create a new record
//@route POST /api/v1/reports
//@access authentication
const createReport: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { event, subject, message, target: targetId } = req.body;
    const reportData = createReportValidator({
        event,
        target: targetId,
        subject,
        message
    });

    // find user
    const user = await User.findById(req.user!.userId);
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    };


    const targets = {
        profile: Profile.findById(reportData.target!),
        service: Service.findById(reportData.target!),
        job: Job.findById(reportData.target!)
    }

    // check if the target is exist
    const target = await targets[reportData.event!];
    if (!target) {
        throw new BadRequestError(`Found no ${reportData.event!} with ID ${reportData.target!}`);
    }

    // check if the target is not an event related to the current user
    if (target.user._id.toString() === user._id.toString()) {
        throw new BadRequestError(`It's not allowed to report your own ${reportData.event!}`);
    }

    // dont allow user to report the same target twice
    const countReports = await Report.countDocuments({ subbmitedByUser: user._id, [reportData.event!]: target.id });
    if (countReports !== 0) {
        throw new BadRequestError(`You have already reported this ${reportData.event!}`);
    }

    // create a new report
    Report.create({
        subbmitedByUser: user._id,
        event: reportData.event!,
        subject: reportData.subject!,
        message: reportData.message,
        [reportData.event!]: target._id
    });

    res.status(StatusCodes.CREATED).json({ msg: `This ${event} has been reported` });
}


//@desc get reported events (profiles/services/jobs)
//@route GET /api/v1/reports
//@access authorization
const getReports: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { event, duration, sort, page } = req.query;

    const initialMatch: mongoose.PipelineStage.Match = {
        $match: {
            $and: [{}]
        }
    }

    // filter by events (jobs, services or profiles)
    if (event) {
        const validReportEvent = !isInvalidEvent(event.toString());
        if (validReportEvent) {
            initialMatch.$match.$and!.push({
                event: event.toString()
            });
        }
    }

    // filter by duration (day, week, month, year)
    if (duration) {
        const validDuration = !isInvalidDuration(duration.toString());
        if (validDuration) {
            const now = new Date();
            const durations = {
                day: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
                week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0),
                month: new Date(now.getFullYear(), now.getMonth(), 0, 0, 0, 0, 0),
                year: new Date(now.getFullYear(), 0, 0, 0, 0, 0, 0)
            }

            initialMatch.$match.$and!.push({
                createdAt: {
                    $gte: durations[duration.toString() as "day" | "week" | "month" | "year"]
                }
            });
        }
    }

    const aggregate: mongoose.PipelineStage[] = [
        initialMatch,
        {
            $lookup: {
                from: "profiles",
                localField: "subbmitedByUser",
                foreignField: "user",
                as: "profile"
            }
        },
        {
            $addFields: {
                submittedBy: {
                    $first: "$profile"
                }
            }
        },
        {
            $project: {
                _id: 1,
                event: 1,
                subject: 1,
                message: 1,
                createdAt: 1,
                "submittedBy.profile": "$submittedBy._id",
                "submittedBy.user": 1,
                "submittedBy.name": 1,
                "submittedBy.userAs": 1
            }
        }
    ];

    // sort by newest and oldest
    if (sort) {
        const validSorting = !isInvalidSorting(sort.toString());
        if (validSorting) {
            const sortBy = {
                newest: -1,
                oldest: 1
            } as const;

            aggregate.push({
                $sort: {
                    createdAt: sortBy[sort as "newest" | "oldest"]
                }
            })
        }
    } else {
        aggregate.push({
            $sort: {
                createdAt: -1 // newest
            }
        });
    }

    // filter by page
    const currentPage = page && /^\d+$/.test(page.toString()) ? Number(page) : 1;
    const displayPerPage = 2;
    const limit = currentPage * displayPerPage;
    const skip = (currentPage - 1) * displayPerPage;
    const pagination: mongoose.PipelineStage[] = [{ $limit: limit }, { $skip: skip }];
    aggregate.push(...pagination);

    // get reports
    const reports = await Report.aggregate(aggregate);

    res.status(StatusCodes.OK).json(reports);
}

export {
    createReport,
    getReports
}