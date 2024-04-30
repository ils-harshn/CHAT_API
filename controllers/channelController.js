const db = require("../db");
const Channel = require("../models/Channel");
const {
  createChannel_SCH,
  addMembersInChannel_SCH,
} = require("../schemas/channel");

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

exports.addMembers = async (req, res, next) => {
  try {
    const { error, value } = addMembersInChannel_SCH.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const channelId = req.params.channelId;
    const { userIds } = value;

    const channel = await db.channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    if (channel.adminId !== req.user.id) {
      return res.status(403).json({ error: "Only admin can add users." });
    }

    const existingUsers = await db.user.findAll({ where: { id: userIds } });
    const existingUserIds = existingUsers.map((user) => user.id);

    const invalidUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId)
    );

    if (invalidUserIds.length > 0) {
      return res
        .status(400)
        .json({ error: "Invalid user IDs", invalidUserIds });
    }

    await channel.addMembers(existingUserIds);

    res.json({ message: "Members added successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
