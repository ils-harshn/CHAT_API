module.exports = (sequelize, Sequelize) => {
  const UserChannel = sequelize.define("UserChannel", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    channelId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  });
  return UserChannel;
};
