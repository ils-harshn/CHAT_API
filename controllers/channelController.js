const db = require("../db");

exports.create = async (req, res, next) => {
  try {
    const channel = await db.channel.create({
      name: channelName,
      adminId: adminId,
    });
    res.json(channel);
  } catch (err) {
    next(err);
  }
};
