import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../../errors";
import Report from "./report.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createReportValidator from "./validators/createReportValidator";
import { User } from "../auth";
import { Profile } from "../profile";
import { serviceModel as Service } from "../service";
import { jobModel as Job } from "../job";


//@desc create a new record
//@route /api/v1/reports
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

export {
    createReport
}