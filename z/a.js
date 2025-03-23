// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST, //stmp.gmail.com
      service: process.env.SERVICE, //gmail
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
  } catch (error) {
    return error;
  }
};

// .env file content

// HOST=stmp.gmail.com
// SERVICE=gmail
// EMAIL_PORT=587
// SECURE=true
// USER=someone@gmail.com
// PASS= get this in the 2 step authentication from google when you register nodemailer as a service provider
module.exports = async (email, subject, htmlcontent) => {
  const trasporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    secure: process.env.SECURE,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.USER,
      password: process.env.PASS,
    },
  });

  try {
    await trasporter.sendEmail({
      from: process.env.USER,
      to: email,
      subject: subject,
      htmll: htmlcontent,
    });
  } catch (error) {
    console.log(error);
  }
};
