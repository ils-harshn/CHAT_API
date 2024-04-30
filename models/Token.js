module.exports = (sequelize, Sequelize) => {
  const TOKEN = sequelize.define("Token", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true, // Ensures each user has at most one TOKEN record
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return TOKEN;
};
