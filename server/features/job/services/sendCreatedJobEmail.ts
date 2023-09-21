import sendEmail from "../../../services/sendEmail";

type CreateJob = {
    email: string;
    jobTitle: string;
    feeAmount: number;
    feeType: "fixed" | "percent";
}

type CreateHourlyPriceJob = CreateJob;

type CreateFixedPriceJobEmail = {
    calculatedPaidAmount: number;
} & CreateJob

const sendCreatedFixedPriceJobEmail = ({ email, jobTitle, calculatedPaidAmount, feeAmount, feeType }: CreateFixedPriceJobEmail) => {

    const createJobContent = `
        <h1>Your new Job has been created</h1>
        <p>Congratulations, you have just created a new fixed price job, you are going to receive proposals from freelancers soon</p>
        <p>Job title: <strong>${jobTitle}</strong></p>
        <p>Fees: <strong>${feeType === "percent" ? `${feeAmount}%` : `$${feeAmount}`}</strong></p>
        <p>Amount paid: <strong>$${calculatedPaidAmount}</strong></p>
    `;

    return sendEmail({
        subject: "Create A New Job - Lets Freelance",
        to: email,
        html: createJobContent
    });
}

const sendCreatedHourlyPriceEmail = ({ email, jobTitle, feeAmount, feeType }: CreateHourlyPriceJob) => {

    const createJobContent = `
        <h1>Your new Job has been created</h1>
        <p>Congratulations, you have just created a new hourly price job, you are going to receive proposals from freelancers soon</p>
        <p>Job title: <strong>${jobTitle}</strong></p>
        <p>Fees: <strong>${feeType === "percent" ? `${feeAmount}%` : `$${feeAmount}`}</strong></p>
        <p>Fees are going to be included for each payment after approving proposals</p>
    `;

    return sendEmail({
        subject: "Create A New Job - Lets Freelance",
        to: email,
        html: createJobContent
    });
}

const sendCreatedJobEmail = {
    fixedPrice: sendCreatedFixedPriceJobEmail,
    hourlyPrice: sendCreatedHourlyPriceEmail
}

export default sendCreatedJobEmail;