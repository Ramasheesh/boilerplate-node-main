const emailService = require("./nodemailer")
const utils = require('./utils')
// const moment = require("moment")
// const config = require('config');
const html =  require('../view/otpBody')

async function sendOtpEmail(email, fullName , otp) {
    const subject = "Your Account verification";
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Responsive Email</title>
    </head>
<body style="background-color: #f0f0f0;
    color: #333;
    font-family: Arial, sans-serif;">
    <div style="max-width: 600px;
    margin: 0 auto;
    padding: 20px;
     padding: 10px;
        max-width: 480px;">
    <h1 style=" text-align: center; font-size: 24px">Welcome to Our Website</h1>
    <p style=" text-align: center;">Hello ${fullName} Your otp is ${ otp} </p>
    <p style=" text-align: center;">Stay up-to-date with the latest news and updates from our company.</p>
    <h2 style=" text-align: center; font-size: 20px;">Featured Article</h2>
    <p style=" text-align: center;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <a href="#" class="cta-button" style=" text-align: center; background-color: #0ff ;  display: block;margin: auto;
        margin: 10px auto; text-decoration: none;
    border-radius: 5px;" >Read More</a>
    </div>
</body>
</html>
    `;
    await emailService.sendEmail(email, subject, html);
}

module.exports = {
    sendOtpEmail,
}


// async function sendEmailForAccountBlock(email, msg) {
//     const subject = "Account Block";
//     await emailService.sendEmail(email, subject, msg)
// }

// module.exports = {
//     sendOtpEmail,
//     sendEmailForAccountBlock
// }
