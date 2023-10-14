const emailService = require("./nodemailer")
const utils = require('./utils')
// const moment = require("moment")
// const config = require('config');
// const html =  require('../view/otpBody')

async function sendOtpEmail(email, fullName , otp ,msg) {
    const subject = "Your Account verification";
    const html = ``;
    await emailService.sendEmail(email, subject, html , msg);
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
