const db = require("../db");

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

module.exports = {
  generateOTP,
  otpExpireTime,
  saveOTP,
};
