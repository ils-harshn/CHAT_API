module.exports = (sequelize, Sequelize) => {
  const OTP = sequelize.define("OTP", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true, // Ensures each user has at most one OTP record
    },
    otp: {
      type: Sequelize.STRING, // Assuming OTPs are alphanumeric strings
      allowNull: false,
    },
    expiresAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  return OTP;
};
