import sendEmail from "../../../services/sendEmail";

type ProposalApprovedEmail = {
    email: string;
    userAs: "freelancer" | "employer";
    proposalId: string;
    jobTitle: string;
}

const sendProposalApprovedEmail = ({ email, proposalId, userAs, jobTitle }: ProposalApprovedEmail) => {

    const freelancerContent = `
        <h1>Your proposal ID ${proposalId} has been approved.</h1>
        <p>You can now start working on the job</p>
        <p>Job title: <strong>${jobTitle}</strong></p>
    `;

    const employerContent = `
        <h1>You have approved proposal ID ${proposalId}</h1>
        <p>The freelancer can start now working on your job</p>
        <p>Job title: <strong>${jobTitle}</strong></p>
    `

    const content = userAs === "freelancer" ? freelancerContent : employerContent;

    return sendEmail({
        subject: "Job Proposal - letsfreelance.io",
        to: email,
        html: content
    });
}

export default sendProposalApprovedEmail;