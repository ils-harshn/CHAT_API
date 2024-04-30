const db = require("../db");
const { sendOTP_Email } = require("../mailer/usersAuthMail");
const { SHA256_ENC } = require("../utils/encrpt");
const { generateOTP, saveOTP, createToken } = require("../utils/helpers");
const {
  signUp_SCH,
  verifyOTP_SCH,
  resendOTP_SCH,
  login_SCH,
} = require("../schemas/auth");

exports.signup = async (req, res, next) => {
  try {
    const { error, value } = signUp_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }
    const newUser = await db.user.create({
      email: value.email,
      password: SHA256_ENC(value.password),
    });
    const OTP = generateOTP();
    await saveOTP(newUser.id, OTP);
    sendOTP_Email(value.email, OTP);
    res.json({
      id: newUser.id,
      email: newUser.email,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { error, value } = verifyOTP_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }
    const { email, otp } = value;
    const user = await db.user.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otpRecord = await db.otp.findOne({ where: { userId: user.id } });

    if (!otpRecord) {
      return res.status(404).json({ message: "OTP not found for this user." });
    }

    if (otpRecord.otp === otp && otpRecord.expiresAt > new Date()) {
      user.is_verified = true;
      await user.save();
      await otpRecord.destroy();
      return res.json({ message: "OTP verified successfully." });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
  } catch (err) {
    next(err);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { error, value } = resendOTP_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }
    const { email } = value;
    const user = await db.user.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.is_verified) {
      return res.status(404).json({ message: "User already verified." });
    }

    const OTP = generateOTP();
    await saveOTP(user.id, OTP);
    sendOTP_Email(email, OTP);
    return res.json({ message: "OTP resent successfully." });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = login_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }
    const { email, password, logoutAll } = value;
    const user = await db.user.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "Email doesn't exists." });
    }

    if (user.is_active === false) {
      return res.status(403).json({ message: "Inactive user." });
    }

    if (user.is_verified === false) {
      return res.status(403).json({ message: "User not verified yet." });
    }

    const password_ENC = SHA256_ENC(password);
    if (password_ENC === user.password) {
      const token = await createToken(user, logoutAll);
      res.json({
        tid: token.id,
        uid: token.userId,
        token: token.token,
      });
    } else {
      res.status(404).json({
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.profile = async (req, res, next) => {
  res.json({
    email: req.user.email,
  });
};
