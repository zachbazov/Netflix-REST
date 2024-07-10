// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const nodemailer = require("nodemailer");
// ------------------------------------------------------------
// MARK: - DISPATCH HANDLER
// ------------------------------------------------------------
const dispatch = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth: {
            user: process.env.MAILER_USERNAME,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    const mailerOptions = {
        from: "iOS Developer <iosdevbz@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailerOptions);
};
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = dispatch;
