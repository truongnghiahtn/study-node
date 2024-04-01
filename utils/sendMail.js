const nodemailer = require("nodemailer");
const pug = require('pug');
const htmlToText = require('html-to-text');
const { convert } = require('html-to-text');

// const sendMail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.HOST_MAIL,
//         port:  process.env.HOST_PORT_MAIL,
//         service: process.env.HOST_SERVICE,
//         auth:{
//             user: process.env.USER_MAIL,
//             pass: process.env.PASS_MAIL,
//         },
//     });

//     const mailOptions = {
//         from: process.env.USER_MAIL,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendMail;
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.USER_MAIL;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.HOST_MAIL,
      port: process.env.HOST_PORT_MAIL,
      service: process.env.HOST_SERVICE,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};