import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import advertisementModels, { Tracker } from "./advertisement.model";
import mongoose, { isValidObjectId } from "mongoose";
import "./display_periods/generates";
import calculateCtr from "./utils/calculateCtr";
import calculateCr from "./utils/calculateCr";
import { Order } from "../service/service.model";
import calculateCpc from "./utils/calculateCpc";



//@desc track ad engagement based on the ad performance
//@route PATCH api/v1/advertisements/performace/engagement
//@access public
const trackAdEngagement: RequestHandler = async (req, res) => {
    const { ad: adId } = req.body;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(adId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid ad ID");
    }

    // find the ad
    const ad = await advertisementModels.Ad.findById(adId);
    if (!ad) {
        throw new BadRequestError(`Found no ad with ID ${adId}`);
    }

    // check if ad is still active
    if (ad.status !== "active") {
        throw new BadRequestError("Inactive ad");
    }

    // check if still a valid display period
    const currentTime = new Date().getTime();
    const isValidDisplayPeriod = ad.displayPeriods.some(displayPeriod => {
        const additionalTime = 15 * 60 * 1000; // 15 min
        const endTime = new Date(new Date(displayPeriod.endTime).getTime() + additionalTime).getTime();
        return new Date(displayPeriod.startTime).getTime() <= currentTime && endTime > currentTime;
    });
    if (!isValidDisplayPeriod) {
        throw new BadRequestError("Invalid ad timing");
    }

    // find ad freelancer to check if he doesnt have any unpaid invoices
    const profile = await Profile.findOne({ user: ad.user, userAs: "freelancer" });
    if (!profile) {
        throw new BadRequestError("Couldn't find ad freelancer");
    }

    // check if the freelancer doesnt have any unpaid invoices
    if (profile.roles.freelancer?.advertisement.unpaidInvoices.length) {
        throw new BadRequestError("Ad has been stopped due to unpaid invoices");
    }

    // find ad's performance
    const performace = await advertisementModels.Performance.findOne({ ad: ad._id });
    if (!performace) {
        throw new BadRequestError(`Found no ad's performances`);
    }

    // if ad event is cpm then increase cpm impression and push 
    if (ad.event === "cpm") {
        performace.cpmImpressions += 1;

        // set ad amount to be paid if cpm impression become 1000
        if (performace.cpmImpressions === 1000) {
            const currentTime = new Date().toLocaleDateString();

            const adAmount = ad.amounts.find(adAmount => {
                const timeToPayCpmImpressions = new Date(adAmount.date).toLocaleDateString();
                if (currentTime === timeToPayCpmImpressions) {
                    return true;
                }
                return false;
            });

            // check if already have amounts for the same day
            if (adAmount) {
                adAmount.amount += ad.bidAmount;
            } else {
                // push new day amount if its the first one today 
                ad.amounts.push({
                    amount: ad.bidAmount,
                    date: new Date()
                });
            }

            // increase budget allocation spent
            ad.budgetAllocationSpend += ad.bidAmount;

            // set budget to completed if the ad has spent the budget allocation
            if (ad.budgetAllocationSpend >= ad.budgetAllocation) {
                ad.budgetAllocationCompleted = true;
            }

            await ad.save();

            // set new campaign payment
            const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id } });
            const payment = campaign!.payments[campaign!.payments.length - 1];
            if (!campaign!.payments.length || payment.status !== "unpaid") {
                campaign!.payments.push({
                    amount: ad.bidAmount,
                    status: "unpaid",
                    invoiceId: ""
                });
            } else {
                payment.amount += ad.bidAmount;
            }

            await campaign!.save();

            // get total spent
            const totalSpent = ad.amounts.reduce((num, ad) => {
                return num + ad.amount;
            }, 0);

            // set new cost per click value because of the change of total spent
            performace.cpc = calculateCpc({
                orders: performace.orders,
                totalSpent
            });

            // reset cpm impressions to 0
            performace.cpmImpressions = 0;
        }
    }

    const newTracker: Tracker = {
        ip: req.ip,
        date: new Date(),
        isClick: false,
        isOrder: false,
        userAgent: req.headers["user-agent"] || "unknown"
    }

    performace.trackers.push(newTracker); // push new tracker data
    performace.displayCount += 1; // increase display count by 1

    const ctr = calculateCtr({
        clicks: performace.clicks,
        impressions: performace.displayCount
    });
    performace.ctr = ctr; // calc new ctr based on the new display count

    const tracker = performace.trackers[performace.trackers.length - 1] as Tracker & { _id: mongoose.Types.ObjectId }; // tracker ID is necessary to mark ads as click or order

    performace.save();

    res.status(StatusCodes.OK).json({ track_id: tracker._id, ad_id: ad._id });
}


//@desc track ad click actions
//@route PATCH api/v1/advertisements/performace/actions/click
//@access public
const trackAdClickAction: RequestHandler = async (req, res) => {
    const { ad: adId, track: trackId } = req.body;

    // check if valid ad mongodb id
    const isValidAdMongodbId = isValidObjectId(adId);
    if (!isValidAdMongodbId) {
        throw new BadRequestError("Invalid ad ID");
    }

    // check if valid track mongodb id
    const isValidTrackMongodbId = isValidObjectId(trackId);
    if (!isValidTrackMongodbId) {
        throw new BadRequestError("Invalid track ID");
    }

    // find the ad
    const ad = await advertisementModels.Ad.findById(adId);
    if (!ad) {
        throw new BadRequestError(`Found no ad with ID ${adId}`);
    }

    // check if ad is still active
    if (ad.status !== "active") {
        throw new BadRequestError("Inactive ad");
    }

    // find ad's performance
    const performace = await advertisementModels.Performance.findOne({ ad: ad._id });
    if (!performace) {
        throw new BadRequestError(`Found no ad's performances`);
    }

    // find tracker
    const tracker = (performace.trackers as (Tracker & { _id: mongoose.Types.ObjectId })[]).find(tracker => tracker._id.toString() === trackId.toString());
    if (!tracker) {
        throw new BadRequestError(`Found no tracker with ID ${trackId}`);
    }

    // return if the user has already clicked on the ad
    if (tracker.isClick) {
        return res.status(StatusCodes.OK).json({ msg: "Ad has already been clicked on" });
    }

    // set new tracker values
    tracker.isClick = true;
    performace.clicks += 1;
    performace.ctr = calculateCtr({
        clicks: performace.clicks,
        impressions: performace.displayCount
    });
    performace.cr = calculateCr({
        clicks: performace.clicks,
        orders: performace.orders
    });

    // save new trackers
    performace.save();


    // push a new amount if the ad event is cpc
    if (ad.event === "cpc") {
        const currentDate = new Date().toLocaleDateString();

        const adAmount = ad.amounts.find(adAmount => {
            const timeToPayCpc = new Date(adAmount.date).toLocaleDateString();
            if (currentDate === timeToPayCpc) {
                return true
            }
            return false;
        });

        // if there is already an amount in the same day then increase it with the new amount
        if (adAmount) {
            adAmount.amount += ad.bidAmount;
        } else {
            // otherwise create a new amount with a new day
            ad.amounts.push({
                amount: ad.bidAmount,
                date: new Date()
            });
        }

        // increase budget allocation spent
        ad.budgetAllocationSpend += ad.bidAmount;

        // set budget to completed if the ad has spent the budget allocation
        if (ad.budgetAllocationSpend >= ad.budgetAllocation) {
            ad.budgetAllocationCompleted = true;
        }

        await ad.save();

        // set new campaign payment
        const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id } });
        const payment = campaign!.payments[campaign!.payments.length - 1];
        if (!campaign!.payments.length || payment.status !== "unpaid") {
            campaign!.payments.push({
                amount: ad.bidAmount,
                status: "unpaid",
                invoiceId: ""
            });
        } else {
            payment.amount += ad.bidAmount;
        }

        await campaign!.save();
    }


    res.status(StatusCodes.OK).json({ track_id: tracker._id, ad_id: ad._id });
}


//@desc track ad order actions
//@route PATCH api/v1/advertisements/performace/actions/order
//@access authentication (employers only)
const trackAdOrderAction: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { track: trackId, order: orderId } = req.body;

    // check if valid mongodb IDs
    const isValidTrackId = isValidObjectId(trackId);
    const isValidOrderId = isValidObjectId(orderId);
    if (!isValidTrackId || !isValidOrderId) {
        throw new BadRequestError("Invalid IDs");
    }

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is an employer
    if (profile.userAs !== "employer") {
        throw new UnauthorizedError("You dont have access. Employers only");
    }

    // find performace
    const performace = await advertisementModels.Performance.findOne({ trackers: { $elemMatch: { _id: trackId } } });
    if (!performace) {
        throw new BadRequestError(`Found no performance has a track ID ${trackId}`);
    }

    // check if already has been clicked on this tracker
    const tracker = (performace.trackers as (Tracker & { _id: mongoose.Types.ObjectId })[]).find(tracker => tracker._id.toString() === trackId.toString());
    if (!tracker!.isClick) {
        throw new BadRequestError("Invalid ad request");
    }

    // find ad
    const ad = await advertisementModels.Ad.findById(performace.ad).populate({ path: "service", select: "orders" });
    if (!ad) {
        throw new BadRequestError("Found no ad related to the performance's tracker ID");
    }

    // check if this order has not been tracked before
    const alreadyTrackedOrder = ad.orders.find(order => order._id.toString() === orderId.toString());
    if (alreadyTrackedOrder) {
        throw new BadRequestError("This order has already been tracked");
    }

    // find order
    const order = (ad.service.orders as (Order & { _id: mongoose.Types.ObjectId })[])!.find(order => order._id.toString() === orderId.toString());
    if (!order) {
        throw new BadRequestError(`Found no order with ID ${orderId}`);
    }

    // check if the order has been made by the current employer
    if (order.employerId !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to this order");
    }

    // push new order to ad orders
    ad.orders.push(order._id);

    // set new reconds
    tracker!.isOrder = true;
    performace.orders += 1;

    // calculate cost per conversion
    const totalSpent = ad.amounts.reduce((num, ad) => {
        return num + ad.amount;
    }, 0)
    performace.cpc = calculateCpc({
        orders: performace.orders,
        totalSpent
    });

    // calculate conversion Rate
    performace.cr = calculateCr({
        clicks: performace.clicks,
        orders: performace.orders
    });

    await ad.save();
    performace.save();

    res.status(StatusCodes.OK).json({ msg: "Tracked new ad order successfully" });
}


export {
    trackAdEngagement,
    trackAdClickAction,
    trackAdOrderAction
}