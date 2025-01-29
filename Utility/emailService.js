require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, html) {
    const msg = {
        to: to,
        from: 'info@erdememre.com',
        subject: subject,
        html: html,
        //or text: 'some text'
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error.response ? error.response.body : error);
    }
};

module.exports = sendEmail;
