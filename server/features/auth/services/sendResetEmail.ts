import sendEmail from "../../../services/sendEmail";

const sendResetEmail = ({ email, token }: { email: string, token: string }) => {
    const confirmEmailUrl = `http://localhost:5000/api/v1/reset-email?token=${token}`;

    const emailContent = `
        <div>
            <h1>We have received a reset email request</h1>
            <p>To reset your email click on "Reset My Email"</p>
            <a rel="noopener" href=${confirmEmailUrl}>Reset My Email</a>
        </div>
    `

    return sendEmail({
        subject: "Reset Email",
        to: email,
        html: emailContent
    })
}

export default sendResetEmail;