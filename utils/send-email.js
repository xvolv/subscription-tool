import { emailTemplates } from "./email-template.js";
import dayjs from "dayjs";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type) throw new Error("Missing required parameters");

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) throw new Error("Invalid email type");

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  };

  try {
    console.log(
      `Attempting to send email to ${to} for subscription ${subscription.name}`
    );
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
          return;
        }
        resolve(info);
      });
    });
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
