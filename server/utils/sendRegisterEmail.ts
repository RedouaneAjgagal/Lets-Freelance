import sendEmail from "./sendEmail";

type RegisterEmail = {
    name: string;
    verificationToken: string;
    email: string;
}

const sendRegisterEmail = ({ name, verificationToken, email }: RegisterEmail) => {
    const confirmEmailUrl = `http://localhost:5000/api/v1/verify-email?token=${verificationToken}&email=${email}`;
    const emailContent = `
    <div>
        <h1>Thank you for joining us ${name}.</h1>
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

export default sendRegisterEmail;