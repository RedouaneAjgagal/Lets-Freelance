import nodemailerConfig from "../config/nodemailerConfig";

type SendEmail = {
    to: string,
    subject: string,
    html: string
}

const sendEmail = ({ to, subject, html }: SendEmail) => {
    return nodemailerConfig.sendMail({
        from: "Let's Freelance App, <support@letsfreelance.io>",
        to,
        subject,
        html
    });
}

export default sendEmail;