require("dotenv").config();
const db = require("../db");
const { GENERATE_TOKEN } = require("./encrpt");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpExpireTime = (minutes = 10) => {
  const expiresAt = new Date(new Date().getTime() + minutes * 60 * 1000);
  return expiresAt;
};

const saveOTP = async (userId, otp) => {
  try {
    const expiresAt = otpExpireTime();
    let otpRecord = await db.otp.findOne({ where: { userId: userId } });
    if (otpRecord) {
      otpRecord.otp = otp;
      otpRecord.expiresAt = expiresAt;
      await otpRecord.save();
    } else {
      otpRecord = await db.otp.create({
        userId: userId,
        otp: otp,
        expiresAt: expiresAt,
      });
    }
    return otpRecord;
  } catch (error) {
    throw error;
  }
};

const createToken = async (user, logoutAll = false) => {
  try {
    let tokenRecord = await db.token.findOne({ where: { userId: user.id } });
    if (tokenRecord) {
      if (logoutAll) {
        tokenRecord.token = GENERATE_TOKEN(user.email, user.id);
        await tokenRecord.save();
      }
    } else {
      tokenRecord = await db.token.create({
        userId: user.id,
        token: GENERATE_TOKEN(user.email, user.id),
      });
    }
    return tokenRecord;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateOTP,
  otpExpireTime,
  saveOTP,
  createToken,
};
