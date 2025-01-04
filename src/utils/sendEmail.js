require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Sends an email using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise<Object>} - Returns an object containing the status of the email.
 */
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.NODEMAILER_SERVICE,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent: ", info.messageId);

        return {
            sent: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            sent: false,
            error: error.message,
        };
    }
};

module.exports = sendEmail;
