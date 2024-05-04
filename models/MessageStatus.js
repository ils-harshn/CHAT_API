module.exports = (sequelize, Sequelize) => {
  const MessageStatus = sequelize.define("MessageStatus", {
    messageId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primary: true,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[0, 1, 2]],
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primary: true,
    },
  });
  return MessageStatus;
};
