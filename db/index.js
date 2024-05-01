const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.db",
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.otp = require("../models/OTP.js")(sequelize, Sequelize);
db.token = require("../models/Token.js")(sequelize, Sequelize);
db.user = require("../models/User.js")(sequelize, Sequelize);
db.channel = require("../models/Channel.js")(sequelize, Sequelize);
db.user_channel = require("../models/UserChannel.js")(sequelize, Sequelize);
db.space = require("../models/Space.js")(sequelize, Sequelize);
db.space_user = require("../models/SpaceUser.js")(sequelize, Sequelize);

// user channel relations
db.user.hasMany(db.channel, { foreignKey: "adminId", as: "adminOfChannels" });
db.channel.belongsTo(db.user, { foreignKey: "adminId", as: "admin" });
db.user.belongsToMany(db.channel, {
  through: db.user_channel,
  foreignKey: "userId",
  as: "channels",
});
db.channel.belongsToMany(db.user, {
  through: db.user_channel,
  foreignKey: "channelId",
  as: "members",
});

// channels spaces relations
db.channel.hasMany(db.space, {
  foreignKey: "channelId",
  as: "spaces",
});
db.space.belongsTo(db.channel, { foreignKey: "channelId", as: "channel" });

// space user relations
db.space.belongsToMany(db.user, {
  through: db.space_user,
  foreignKey: "spaceId",
  as: "members",
});
db.user.belongsToMany(db.space, {
  through: db.space_user,
  foreignKey: "userId",
  as: "spaces",
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

module.exports = db;
