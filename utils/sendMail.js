const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAIL,
        port:  process.env.HOST_PORT_MAIL,
        service: process.env.HOST_SERVICE,
        auth:{
            user: process.env.USER_MAIL,
            pass: process.env.PASS_MAIL,
        },
    });

    const mailOptions = {
        from: process.env.USER_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;