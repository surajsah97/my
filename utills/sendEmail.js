const nodeMailer = require("nodemailer");

const sendEmail = async (optionsed) => {
  // console.log(optionsed.message,"0000000000000000000")
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    secure:true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: optionsed.email,
    subject: optionsed.subject,
    text: optionsed.message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;