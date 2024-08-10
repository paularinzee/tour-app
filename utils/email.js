 const nodemailer = require('nodemailer');

 const sendEmail = async options => {
 // Create a transporter
 const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }

 });

 //Define mail options
 const mailOptions = {
    from: 'Paul Nnaji <hello@pauk.io>',
    to: options.email,
    subject: options.subject,
    text: options.message

 };

 //send email
 await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

