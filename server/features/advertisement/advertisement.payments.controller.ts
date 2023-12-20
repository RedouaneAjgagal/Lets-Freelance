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



//@desc set payment methods info for advertisements
//@route POST /api/v1/advertisements/payment-methods
//@access authentication (freelancers only)
const createPaymentMethods: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { cardToken, name, email } = req.body;

    // find user
    const user = await User.findById(req.user!.userId);
    const profile = await Profile.findOne({ user: user?._id });
    if (!user || !profile) {
        throw new UnauthenticatedError("Found no user");
    }


    // check if the user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("You dont have access to create payment methods. Freelancers only");
    }

    // check if valid values
    createCustomerValidator({ cardToken, name, email });

    const customerDetails = {
        userId: user._id.toString(),
        cardToken,
        email,
        name
    }

    // if the freelancer already is a customer then create another payment method for the same customer
    if (user.stripe.customer_id) {
        const paymentMethod = await createPaymentMethodAndAttachToCustomer({ ...customerDetails, customerId: user.stripe.customer_id });

        // make the new payment method as default payment
        await stripe.customers.update(user.stripe.customer_id, {
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
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

        return res.status(StatusCodes.CREATED).json({ msg: "New payment method has been added successfully" });
    }

    // create new customer
    const customer = await createCustomer(customerDetails);

    // set customer ID to the user
    user.stripe.customer_id = customer.id;
    await user.save();

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
    createPaymentMethods,
    getPaymentMethods,
    deletePaymentMethod
}