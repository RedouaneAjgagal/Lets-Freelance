import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import stripe from "../stripeConntect";
import Stripe from "stripe";
import { advertisementModels } from "../../features/advertisement";
import mongoose from "mongoose";
import { Profile } from "../../features/profile";
import { RawBodyRequest } from "../stripe.router";

type SetUnpaidInvoice = {
    userId: string;
    invoiceId: string;
}

type UpdateCampaign = {
    type: "created" | "succeeded" | "failed";
    invoiceId: string;
    userId: string;
    campaignIds: string[];
    paymentIds: string[];
    at: Date
}

export const updateCampaign = (payload: UpdateCampaign) => {
    const objectCampaignIds = payload.campaignIds.map(id => new mongoose.Types.ObjectId(id));
    const objectPaymentIds = payload.paymentIds.map(id => new mongoose.Types.ObjectId(id));
    const userId = payload.userId.toString();
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const status = {
        created: "pending",
        succeeded: "paid",
        failed: "failed"
    }

    advertisementModels.Campaign.bulkWrite([
        {
            updateMany: {
                filter: {
                    $and: [
                        { _id: { $in: objectCampaignIds } },
                        { user: objectUserId }
                    ]
                },
                update: {
                    $set: {
                        "payments.$[element].status": status[payload.type],
                        "payments.$[element].invoiceId": payload.invoiceId,
                        "payments.$[element].at": payload.at
                    }
                },
                arrayFilters: [
                    {
                        "element._id": { $in: objectPaymentIds }
                    }
                ]
            }
        }
    ]);
}


export const setUnpaidInvoiceToProfile = (payload: SetUnpaidInvoice) => {
    const objectUserId = new mongoose.Types.ObjectId(payload.userId);

    Profile.bulkWrite([
        {
            updateOne: {
                filter: {
                    user: objectUserId,
                    userAs: "freelancer"
                },
                update: {
                    $addToSet: {
                        "roles.freelancer.advertisement.unpaidInvoices": payload.invoiceId
                    }
                }
            }
        }
    ]);
}

const invoiceWebhook = (req: RawBodyRequest, res: Response) => {
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody!, sig, process.env.STRIPE_SIGNING_SECRET!);
    } catch (error: any) {
        console.log(`Webhook error: ${error.message}`);
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Something went wrong` });
    }

    switch (event.type) {
        case "invoice.payment_succeeded":
            const invoicePaymentSucceeded = event.data.object as Stripe.Event.Data.Object & Stripe.Response<Stripe.Invoice>;

            updateCampaign({
                type: "succeeded",
                userId: invoicePaymentSucceeded.metadata!.freelancer_user_id,
                invoiceId: invoicePaymentSucceeded.id,
                campaignIds: invoicePaymentSucceeded.lines.data.map(data => data.metadata.campaign_id),
                paymentIds: invoicePaymentSucceeded.lines.data.map(data => data.metadata.payment_id),
                at: new Date(invoicePaymentSucceeded.created * 1000)
            });

            break;
        case "invoice.payment_failed":
            const invoicePaymentFailed = event.data.object as Stripe.Event.Data.Object & Stripe.Response<Stripe.Invoice>;

            updateCampaign({
                type: "failed",
                userId: invoicePaymentFailed.metadata!.freelancer_user_id,
                invoiceId: invoicePaymentFailed.id,
                campaignIds: invoicePaymentFailed.lines.data.map(data => data.metadata.campaign_id),
                paymentIds: invoicePaymentFailed.lines.data.map(data => data.metadata.payment_id),
                at: new Date(invoicePaymentFailed.created * 1000)
            });

            setUnpaidInvoiceToProfile({
                invoiceId: invoicePaymentFailed.id,
                userId: invoicePaymentFailed.metadata!.freelancer_user_id
            });

            break;
        default:
            break;
    }

    res.status(StatusCodes.OK).json({ msg: "Success!" });
}

export default invoiceWebhook;