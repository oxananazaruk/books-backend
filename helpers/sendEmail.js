require("dotenv").config();

// ---------------SENDGRID----------------
const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "oxana@gmail.com" };
  await sgMail.send(email);
};

module.exports = sendEmail;

// const email = {
//   to: "mojeno2135@tupanda.com",
//   from: "oxana@gmail.com",
//   subject: "Test email",
//   html: "<p><stromg>Test email</stromg></p>",
// };

// sgMail
//   .send(email)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.mssage));
// ------------------------------------------------
