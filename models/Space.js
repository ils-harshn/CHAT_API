module.exports = (sequelize, Sequelize) => {
  const Space = sequelize.define("Space", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    channelId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Space;
};
