import stripe from "../../../stripe/stripeConntect";
import getCampaignsReadyToPay, { FreelancerCampaigns } from "./getCampaignsReadyToPay";
import { transferToStripeDecimalAmount } from "../../../stripe/utils/transferToStripeAmount";
import { updateCampaign } from "../../../stripe/index";


export const setNewInvoice = async (freelancerCampaigns: FreelancerCampaigns) => {
    const invoice = await stripe.invoices.create({
        customer: freelancerCampaigns.user.stripe.customer_id,
        collection_method: "charge_automatically",
        description: "Paying advertisements",
        metadata: {
            freelancer_user_id: freelancerCampaigns.user._id.toString(),
        }
    });


    await Promise.all(
        freelancerCampaigns.campaigns.map(async (campaign) => {
            const price = await stripe.prices.create({
                unit_amount_decimal: transferToStripeDecimalAmount(campaign.payment.amount),
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
        })
    );

    updateCampaign({
        type: "created",
        campaignIds: freelancerCampaigns.campaigns.map(campaign => campaign._id.toString()),
        paymentIds: freelancerCampaigns.campaigns.map(campaign => campaign.payment._id.toString()),
        userId: freelancerCampaigns.user._id.toString(),
        invoiceId: invoice.id,
        at: new Date()
    });

    await stripe.invoices.pay(invoice.id);
}


const setNewInvoices = async () => {
    console.log("Set new invoices is running..");

    // get freelancer's campaigns the are ready to be paid
    const freelancersCampaigns = await getCampaignsReadyToPay();
    console.log(`Found ${freelancersCampaigns.length} invoices that need to be paid`);

    const BATCH_SIZE = 6; // use batching to avoid stripe rate limitation (25 requests in test mode)
    const LIMIT = Math.ceil(freelancersCampaigns.length / 4); // use divide by 4 because each call in setNewInvoice have 4 http requests to stripe and BATCHING is 6 that makes it 24 requests

    for (let i = 1; i <= LIMIT; i++) {
        const start = (BATCH_SIZE * i) - BATCH_SIZE;
        const end = BATCH_SIZE * i;

        const campaigns = freelancersCampaigns.slice(start, end);

        await Promise.all(
            campaigns.map(async (freelancerCampaigns) => {
                try {
                    await setNewInvoice(freelancerCampaigns);
                    console.log(`Create invoices..`);

                } catch (error: any) {
                    console.log(`Error setting invoices round ${i} of ${LIMIT}, reason: ${error.message}`);
                }
            })
        );
    }

    console.log(`Set new invoices is done`);
}

export default setNewInvoices;