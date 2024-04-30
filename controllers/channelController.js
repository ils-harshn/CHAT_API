const db = require("../db");
const { createChannel_SCH } = require("../schemas/channel");

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createChannel_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }
    const channel = await db.channel.create({
      name: value.name,
      adminId: req.user.id,
    });
    await channel.addMembers([req.user.id]);
    res.json(channel);
  } catch (err) {
    next(err);
  }
};
