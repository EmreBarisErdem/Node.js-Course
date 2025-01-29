require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(email, subject, html, text) {

    const msg = {
        to: email,
        from: 'info@example.com',
        subject: subject,
        html: html,
        text: text
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error.response ? error.response.body : error);
    }
};

module.exports = sendEmail;
