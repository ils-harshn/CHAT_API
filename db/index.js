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

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

module.exports = db;
