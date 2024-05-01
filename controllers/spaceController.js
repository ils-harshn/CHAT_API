const db = require("../db");
const { createSpace_SCH } = require("../schemas/space");

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSpace_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }
    const channelId = req.params.channelId;
    const user_channel = await db.user_channel.findOne({
      where: {
        userId: req.user.id,
        channelId: channelId,
      },
    });

    if (!user_channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const space = await db.space.create({
      name: value.name,
      channelId: channelId,
      type: "MANY",
    });

    res.json(space);
  } catch (err) {
    next(err);
  }
};
