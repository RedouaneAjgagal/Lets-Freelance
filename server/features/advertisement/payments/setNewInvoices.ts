import stripe from "../../../stripe/stripeConntect";
import getCampaignsReadyToPay, { FreelancerCampaigns } from "./getCampaignsReadyToPay";
import transferToStripeAmount from "../../../stripe/utils/transferToStripeAmount";
import { updateCampaign } from "../../../stripe/index";


export const setNewInvoice = async (freelancerCampaigns: FreelancerCampaigns) => {
    const invoice = await stripe.invoices.create({
        customer: freelancerCampaigns.user.stripe.customer_id,
        collection_method: "charge_automatically",
        auto_advance: true,
        description: "Paying advertisements",
        metadata: {
            freelancer_user_id: freelancerCampaigns.user._id.toString(),
        }
    });

    freelancerCampaigns.campaigns.forEach(async (campaign) => {
        const price = await stripe.prices.create({
            unit_amount: transferToStripeAmount(campaign.payment.amount),
            currency: "usd",
            product_data: {
                name: `Campaign: ${campaign.name}`
            },
            metadata: {
                campaign_id: campaign._id.toString(),
                payment_id: campaign.payment._id.toString()
            }
        });

        await stripe.invoiceItems.create({
            customer: freelancerCampaigns.user.stripe.customer_id,
            price: price.id,
            quantity: 1,
            invoice: invoice.id,
            metadata: {
                campaign_id: campaign._id.toString(),
                payment_id: campaign.payment._id.toString()
            }
        });
    });

    updateCampaign({
        type: "created",
        campaignIds: freelancerCampaigns.campaigns.map(campaign => campaign._id.toString()),
        paymentIds: freelancerCampaigns.campaigns.map(campaign => campaign.payment._id.toString()),
        userId: freelancerCampaigns.user._id.toString(),
        invoiceId: invoice.id,
    });
}


const setNewInvoices = async () => {
    console.log("Set new invoices is running..");
    const freelancersCampaigns = await getCampaignsReadyToPay();
    console.log(`Found ${freelancersCampaigns.length} invoices that need to be paid`);
    freelancersCampaigns.forEach(async (freelancerCampaigns) => {
        await setNewInvoice(freelancerCampaigns);
    });
    console.log(`Set new invoices is done`);
}

export default setNewInvoices;