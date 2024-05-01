module.exports = (sequelize, Sequelize) => {
  const SpaceUser = sequelize.define("SpaceUser", {
    spaceId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  });

  return SpaceUser;
};
