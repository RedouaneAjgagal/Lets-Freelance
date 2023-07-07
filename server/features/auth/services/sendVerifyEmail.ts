import origin from "../../../config/origin";
import sendEmail from "../../../services/sendEmail";

type VerifyEmail = {
    email: string;
    verificationToken: string;
    emailTitle: string;
}

const sendVerifyEmail = ({ email, verificationToken, emailTitle }: VerifyEmail) => {
    const confirmEmailUrl = `${origin}/auth/verify-email?token=${verificationToken}&email=${email}`;
    const emailContent = `
    <div>
        <h1>${emailTitle}</h1>
        <p>To confirm your email click on "Confirm My Email"</p>
        <a rel="noopener" href=${confirmEmailUrl}>Confirm My Email</a>
    </div>
    `
    return sendEmail({
        subject: "Email Confirmation",
        to: email,
        html: emailContent,
    });
}

export default sendVerifyEmail;