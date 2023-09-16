import sendEmail from "../../../services/sendEmail";
import serviceFees from "../service.fees";
import getServicePriceAfterFees from "../utils/getServicePriceAfterFees";

type OrderServiceEmail = {
    email: string;
    userAs: "freelancer" | "employer";
    serviceTitle: string;
    tierName: "starter" | "standard" | "advanced";
    serviceId: string;
    servicePrice: number;
}

const sendOrderServiceEmail = ({ email, userAs, serviceId, serviceTitle, tierName, servicePrice }: OrderServiceEmail) => {

    const { freelancerReceiveAmount } = getServicePriceAfterFees({
        servicePrice
    });

    const freelancerContent = `
        <h1>You have got a new service order</h1>
        <p>You can now start working on the service</p>
        <p>Service ID ${serviceId}, tier <strong>${tierName}</strong></p>
        <p>Service title: <strong>${serviceTitle}</strong></p>
        <p>Order amount: <strong>$${servicePrice}</strong></p>
        <p>Service fee: <strong>${serviceFees.type === "percent" ? `${serviceFees.amount}%` : `$${serviceFees.amount}`}</strong></p>
        <p>Receive amount: <strong>$${freelancerReceiveAmount}</strong></p>
    `

    const employerContent = `
        <h1>You have ordered a service</h1>
        <p>The freelancer now can work on the service</p>
        <p>Service ID ${serviceId}, tier <strong>${tierName}</strong></p>
        <p>Service title: <strong>${serviceTitle}</strong></p>
        <p>Order amount: <strong>$${servicePrice}</strong></p>
    `

    const content = userAs === "freelancer" ? freelancerContent : employerContent;

    return sendEmail({
        subject: "Service Order - letsfreelance.io",
        to: email,
        html: content
    });
}

export default sendOrderServiceEmail;