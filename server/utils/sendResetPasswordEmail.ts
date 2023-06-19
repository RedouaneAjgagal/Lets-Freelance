import sendEmail from "./sendEmail";

type ResetPasswordEmail = {
    email: string;
    resetPasswordToken: string;
}

const sendResetPasswordEmail = ({ email, resetPasswordToken }: ResetPasswordEmail) => {
    const confirmEmailUrl = `http://localhost:5000/api/v1/reset-password?token=${resetPasswordToken}&email=${email}`;
    const emailContent = `
    <div>
        <h1>We have received a reset password request</h1>
        <p>To change your passowrd click on "Change My Password"</p>
        <a rel="noopener" href=${confirmEmailUrl}>Change My Password</a>
    </div>
    `
    return sendEmail({
        subject: "Reset Password",
        to: email,
        html: emailContent,
    });
}

export default sendResetPasswordEmail;