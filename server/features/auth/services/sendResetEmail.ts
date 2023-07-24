import sendEmail from "../../../services/sendEmail";
import origin from "../../../config/origin";

const sendResetEmail = ({ email, token }: { email: string, token: string }) => {
    const confirmEmailUrl = `${origin}/profile/settings/reset-email?token=${token}`;

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