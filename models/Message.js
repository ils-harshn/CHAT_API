module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define("Message", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    spaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return Message;
};
