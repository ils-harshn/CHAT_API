module.exports = (sequelize, Sequelize) => {
  const Channel = sequelize.define("Channel", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    adminId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Channel;
};
