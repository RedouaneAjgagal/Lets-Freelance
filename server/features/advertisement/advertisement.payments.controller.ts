import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import createCustomer from "../../stripe/createCustomer";
import { User } from "../auth";
import createCustomerValidator from "./validators/createCustomerValidator";
import stripe from "../../stripe/stripeConntect";
import { createPaymentMethodAndAttachToCustomer } from "../../stripe/createPaymentMethod";
import "./payments/invoicesSchedule";


//@desc set new payment method using stripe setup intent (need client_secret for the clientSide)
//@route POST /api/v1/advertisements/intent
//@access authentication (freelancers only)
const createStripeSetupIntent: RequestHandler = async (req: CustomAuthRequest, res) => {
    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "userAs roles name" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is a freelancer
    if (user.profile?.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to create payment methods. Freelancers only");
    }

    // make the current freelancer a customer if not already is
    if (!user.stripe.customer_id) {
        const customer = await stripe.customers.create({
            name: user.profile.name,
            email: user.email,
            metadata: {
                freelancer_user_id: user._id.toString()
            }
        });

        user.stripe.customer_id = customer.id;
        await user.save();
    }

    // get stripe client secret to confirm payment method on the client side
    const { client_secret } = await stripe.setupIntents.create({
        customer: user.stripe.customer_id,
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never"
        }
    });

    // add unpaidIncoices boolean, if true make another request on the client to try and pay the invoices 
    const hasUnpaidInvoices = user.profile.roles!.freelancer!.advertisement.unpaidInvoices.length > 0;

    res.status(StatusCodes.OK).json({ client_secret, hasUnpaidInvoices });
}


//@desc set paymentMethod to default and pay unpaidInvoices if any exist
//@route POST /api/v1/advertisements/payment-methods
//@access authentication (freelancers only)
const payUnpaidInvoicesAfterNewPaymentMethod: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { paymentMethodId } = req.body;

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "stripe" });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to create payment methods. Freelancers only");
    }

    // check if the freelancer is already a customer
    if (!profile.user.stripe!.customer_id) {
        throw new BadRequestError("Invalid customer");
    }

    // set the new payment method to default payment
    await stripe.customers.update(profile.user.stripe!.customer_id, {
        invoice_settings: {
            default_payment_method: paymentMethodId
        }
    });

    // check if there is unpaid invoices
    if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
        // pay all invoices
        for (const unpaidInvoice of profile.roles.freelancer!.advertisement.unpaidInvoices) {
            try {
                const invoice = await stripe.invoices.pay(unpaidInvoice);

                // if the invoice has been paid successful then remove the unpaid invoice id from the unpaid invoices array
                if (invoice.status === "paid") {
                    profile.roles.freelancer!.advertisement.unpaidInvoices = profile.roles.freelancer!.advertisement.unpaidInvoices.filter(unpaidInvoice => unpaidInvoice !== invoice.id);
                    profile.save();
                }
            } catch (error: any) {
                // check if the freelancer tried until the invoice is no longer payable
                if (error.message.startsWith("This invoice can no longer be paid")) {
                    // create a new invoice based on the unpayable invoice
                    const clonedInvoice = await stripe.invoices.create({
                        from_invoice: {
                            action: "revision",
                            invoice: unpaidInvoice
                        }
                    });

                    // push the new invoice as unpaid invoice
                    profile.roles.freelancer!.advertisement.unpaidInvoices.push(clonedInvoice.id);

                    // remove the unpayable invoice from freelancer's unpaid invoices to avoid the duplication
                    profile.roles.freelancer!.advertisement.unpaidInvoices = profile.roles.freelancer!.advertisement.unpaidInvoices.filter(freelancerUnpaidInvoice => freelancerUnpaidInvoice !== unpaidInvoice);
                    await profile.save();

                    try {
                        await stripe.invoices.pay(clonedInvoice.id);
                        return res.status(StatusCodes.CREATED).json({ msg: "New payment method has been added successfully" });
                    } catch (error: any) {
                        console.log(`Invoice pay error when attaching new payment method after making a new invoice clone: ${error.message}`);
                        throw new BadRequestError(`Unable to pay unpaid invoices after setting the new payment method`);
                    }
                }

                console.log(`Invoice pay error when attaching new payment method: ${error.message}`);
                throw new BadRequestError(`Unable to pay unpaid invoices after setting the new payment method`);
            }
        }
    }

    res.status(StatusCodes.CREATED).json({ msg: "Payment method has been added successfully" });
}


//@desc get payment methods info
//@route GET /api/v1/advertisements/payment-methods
//@access authentication (freelancers only)
const getPaymentMethods: RequestHandler = async (req: CustomAuthRequest, res) => {
    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "_id userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is a freelancer
    if (user.profile!.userAs !== "freelancer") {
        throw new BadRequestError("You dont have access to payment methods. Freelancers only");
    }

    // if the freelancer didnt set a payment method then return an empty array
    if (!user.stripe.customer_id) {
        return res.status(StatusCodes.OK).json([]);
    }

    // get freelancer's payment methods
    const paymentMethods = await stripe.paymentMethods.list({ customer: user.stripe.customer_id });

    const cards = paymentMethods.data.map(data => {
        const cardDetails = {
            id: data.id,
            brand: data.card!.brand,
            exp_month: data.card!.exp_month,
            exp_year: data.card!.exp_year,
            last4: data.card!.last4,
            createdAt: data.created
        };

        return cardDetails;
    });

    // make the default payment method be first
    cards.sort((a, b) => b.createdAt - a.createdAt);

    res.status(StatusCodes.OK).json(cards);
}


//@desc delete payment method
//@route DELETE /api/v1/advertisements/payment-methods/:paymentMethodId
//@access authentication (freelancers only)
const deletePaymentMethod: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { paymentMethodId } = req.params;
    // check if paymentMethodId is exist
    if (!paymentMethodId || paymentMethodId.toString().trim() === "") {
        throw new BadRequestError("Payment method ID is missing");
    }

    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "_id userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if user is a freelancer
    if (user.profile!.userAs !== "freelancer") {
        throw new BadRequestError("You dont have access to delete payment methods. Freelancers only");
    }

    // check if the freelancer is already a customer
    if (!user.stripe.customer_id) {
        throw new BadRequestError("You haven't set a payment method yet");
    }

    // get the stripe customer
    const paymentMethods = await stripe.paymentMethods.list({ customer: user.stripe.customer_id });
    // sort by newest
    paymentMethods.data.sort((a, b) => b.created - a.created);

    const paymentMethod = paymentMethods.data.find(data => data.id === paymentMethodId.toString());
    if (!paymentMethod) {
        throw new NotFoundError(`Found no payment method with ID ${paymentMethodId}`);
    }

    // detach payment method from customer's payment methods
    await stripe.paymentMethods.detach(paymentMethod.id);

    // if default payment method has been detached then make the latest one created to be default
    if ((paymentMethods.data[0].id === paymentMethod.id) && paymentMethods.data.length > 1) {
        const updatedPaymentMethods = paymentMethods.data.filter(data => data.id !== paymentMethod.id);

        const defaultPaymentMethod = updatedPaymentMethods[0];

        await stripe.customers.update(defaultPaymentMethod.customer!.toString(), {
            invoice_settings: {
                default_payment_method: defaultPaymentMethod.id
            }
        });
    }

    res.status(StatusCodes.OK).json({ msg: `The ${paymentMethod.card!.brand} card ending in ${paymentMethod.card!.last4} was removed` });
}

export {
    createStripeSetupIntent,
    payUnpaidInvoicesAfterNewPaymentMethod,
    getPaymentMethods,
    deletePaymentMethod
}