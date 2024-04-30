const db = require("../db");
const { sendOTP_Email } = require("../mailer/usersAuthMail");
const { generateOTP, saveOTP } = require("../utils/helpers");
const { signUp_SCH } = require("../utils/schema");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.user.findAll();
    res.json({
      users,
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { error, value } = signUp_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }
    const newUser = await db.user.create(value);
    const OTP = generateOTP();
    await saveOTP(newUser.id, OTP);
    sendOTP_Email(value.email, OTP);
    res.json(newUser);
  } catch (err) {
    next(err);
  }
};
