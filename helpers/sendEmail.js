const emailService = require("./nodemailer")
const utils = require('./utils')
// const moment = require("moment")
// const config = require('config');
const html =  require('../view/otpBody')

async function sendOtpEmail(email, fullName) {
    const subject = "Your Account verification";
    let otp = utils.randomPin(4);
//     const html = `<html>
//     <body>
//       <p>Hello ${fullName},</p>
//       <p>Your One Time OTP is <strong>${otp}</strong></p>
//     </body>
//   </html>`;

    // let html = `Hello ${fullName} Your One Time OTP is ` + utils.randomPin(4);
    await emailService.sendEmail(email, subject, html.htmlBody)
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
