import sendEmail from "../../../services/sendEmail";

type SendPaidHoursEmail = {
    email: string;
    userAs: "freelancer" | "employer";
    paymentId: string;
    workedHours: number;
    amount: number;
    feesType: "percent" | "fixed" | undefined;
    feesAmount: number | undefined;
    amountIncludingFees: number;
}

const sendPaidHoursEmail = ({ email, userAs, paymentId, amountIncludingFees, feesAmount, feesType, workedHours, amount }: SendPaidHoursEmail) => {

    const fees = feesType === "percent" ? `%${feesAmount}` : `$${feesAmount}`;

    const freelancerContent = `
        <h1>Payment ID ${paymentId} has been paid</h1>
        <p>Worked hours: <strong>${workedHours}</strong></p>
        <p>Amount with no fees: <strong>$${amount}</strong></p>
        <p>Receive: <strong>$${amountIncludingFees}</strong></p>
        <p>You will receive your payment within 10 days</p>
    `;


    const employerContent = `
        <h1>Payment ID ${paymentId} has been paid</h1>
        <p>Worked hours: <strong>${workedHours}</strong></p>
        <p>Amount: <strong>$${amount}</strong></p>
        <p>Fees: <strong>${fees}</strong></p>
        <p>Paid: <strong>$${amountIncludingFees}</strong></p>
        <p>The freelancer is going to receive the payment soon</p>
    `;

    const content = userAs === "freelancer" ? freelancerContent : employerContent

    return sendEmail({
        subject: "Paid Hours job - Lets Freelance",
        to: email,
        html: content
    })
}

export default sendPaidHoursEmail;