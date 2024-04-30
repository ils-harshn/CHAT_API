require("dotenv").config();
const nodemailer = require("nodemailer");

const EMAIL = process.env.EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = {
  transporter,
  EMAIL,
};
