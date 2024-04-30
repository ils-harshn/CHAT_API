const db = require("../db");
const Channel = require("../models/Channel");
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

exports.list = async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.user.id, {
      include: [
        {
          model: db.channel,
          as: "channels",
          attributes: ["id", "name", "adminId"],
          through: { attributes: [] },
        },
      ],
    });

    res.json(user.channels);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
