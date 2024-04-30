const { transporter, EMAIL } = require(".");

async function sendOTP_Email(to, OTP) {
  const mailOptions = {
    from: EMAIL,
    to: to,
    subject: "Chat API (SignUp OTP Test)",
    text: `TEST OTP: ${OTP}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTP_Email };
