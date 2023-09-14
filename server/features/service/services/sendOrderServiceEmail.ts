import sendEmail from "../../../services/sendEmail";

type OrderServiceEmail = {
    email: string;
    userAs: "freelancer" | "employer";
    serviceTitle: string;
    tierName: "starter" | "standard" | "advanced";
    serviceId: string;
    servicePrice: number;
}

const sendOrderServiceEmail = ({ email, userAs, serviceId, serviceTitle, tierName, servicePrice }: OrderServiceEmail) => {

    const freelancerContent = `
        <h1>You have got a new service order</h1>
        <p>You can now start working on the service</p>
        <p>Service ID ${serviceId}, tier <strong>${tierName}</strong></p>
        <p>Service title: <strong>${serviceTitle}</strong></p>
        <p>You going to receive <strong>$${servicePrice}</strong> by completing the service</p>
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