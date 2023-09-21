import sendEmail from "../../../services/sendEmail";

type FixedPriceProposalApprovedEmail = {
    email: string;
    userAs: "freelancer" | "employer";
    proposalId: string;
    jobTitle: string;
    price: number;
    totalAmoutWithFees?: number;
}

type HourlyPriceProposalApprovedEmail = {
    email: string;
    userAs: "freelancer" | "employer";
    proposalId: string;
    jobTitle: string;
    price: number;
}

const hourlyPriceProposal = ({ email, proposalId, userAs, jobTitle, price }: HourlyPriceProposalApprovedEmail) => {

    const freelancerContent = `
        <h1>Your proposal ID ${proposalId} has been approved.</h1>
        <p>You can now start working on the job</p>
        <p>Job title: <strong>${jobTitle}</strong></p>
        <p>Hourly price: <strong>$${price}</strong></p>
    `;

    const employerContent = `
        <h1>You have approved proposal ID ${proposalId}</h1>
        <p>The freelancer can start now working on your job</p>
        <p>Job title: <strong>${jobTitle}</strong></p>
        <p>Hourly price: <strong>$${price}</strong></p>
    `

    const content = userAs === "freelancer" ? freelancerContent : employerContent;

    return sendEmail({
        subject: "Job Proposal - letsfreelance.io",
        to: email,
        html: content
    });
}


const fixedPriceProposal = ({ email, proposalId, userAs, jobTitle, price, totalAmoutWithFees }: FixedPriceProposalApprovedEmail) => {

    const freelancerContent = `
        <h1>Your proposal ID ${proposalId} has been approved.</h1>
        <p>You can now start working on the job</p>
        <p>Job title: <strong>${jobTitle}</strong></p>
        <p>Fixed price: <strong>$${price}</strong></p>
    `;

    const employerContent = `
        <h1>You have approved proposal ID ${proposalId}</h1>
        <p>The freelancer can start now working on your job</p>
        <p>Job title: <strong>${jobTitle}</strong></p>
        <p>Fixed price: <strong>$${price}</strong></p>
        <p>Paid amount including fees: <strong>$${totalAmoutWithFees}</strong></p>
    `

    const content = userAs === "freelancer" ? freelancerContent : employerContent;

    return sendEmail({
        subject: "Job Proposal - letsfreelance.io",
        to: email,
        html: content
    });
}

const sendProposalApprovedEmail = {
    hourlyPriceProposal,
    fixedPriceProposal
}

export default sendProposalApprovedEmail;