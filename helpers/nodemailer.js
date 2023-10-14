const config = require('config');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
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


// const API_KEY ="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"
// // SMTP serversmtp-relay.sendinblue.com
// // Port  :587
// // Login :oliverschweizer@tromdigital.com
// // Password :d09DcpvAzkIUMP2Q
// var SibApiV3Sdk = require('sib-api-v3-sdk');
// var defaultClient = SibApiV3Sdk.ApiClient.instance;
// // Configure API key authorization: api-key
// var apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = API_KEY;
// // Uncomment below two lines to configure authorization using: partner-key
// // var partnerKey = defaultClient.authentications['partner-key'];
// // partnerKey.apiKey = 'YOUR API KEY';
// var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
// sendSmtpEmail = {
// 	to: [{
// 		email: 'testmail@example.com',
// 		name: 'John Doe'
// 	}],
// 	templateId: 59,
// 	params: {
// 		name: 'John',
// 		surname: 'Doe'
// 	},
// 	headers: {
// 		'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
// 	}
// };
// apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
//   console.log('API called successfully. Returned data: ' + data);
// }, function(error) {
//   console.error(error);})