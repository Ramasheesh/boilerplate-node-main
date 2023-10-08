const config = require('config');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    },
    tls: {
        rejectUnauthorized: true
    }
});


const sendEmail = async (to, subject, message) => {//*****
    // console.log('to: ', to);
        let test = await transporter.sendMail({
        // from: config.get('EMAIL_SERVICE').EMAIL,
        from: process.env.USER_EMAIL, // sender address
        to: to, // list of receivers
        subject: subject,
        text: message,
        html: message, // html body
    })
    return test
}


module.exports ={sendEmail}