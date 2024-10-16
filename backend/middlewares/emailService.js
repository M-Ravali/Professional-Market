const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: config.emailSecure, // true for 465, false for other ports
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

exports.sendEmail = async (to, subject, text, html) => {
    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Professional Market" <${config.emailUser}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html // html body
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};