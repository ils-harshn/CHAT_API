const db = require("../db");
const { createSpace_SCH, addMembersInSpace_SCH } = require("../schemas/space");

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

    await space.addMembers([req.user.id]);

    res.json(space);
  } catch (err) {
    next(err);
  }
};

exports.addMembers = async (req, res, next) => {
  try {
    const { error, value } = addMembersInSpace_SCH.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const channelId = req.params.channelId;
    const spaceId = req.params.spaceId;
    const { userIds } = value;

    const space = await db.space.findByPk(spaceId);

    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    if (space.channelId !== parseInt(channelId)) {
      return res.status(404).json({ error: "Space not found in this channel" });
    }

    const space_user = await db.space_user.findAll({
      where: {
        spaceId: spaceId,
        userId: req.user.id,
      },
    });

    if (!space_user) {
      return res
        .status(404)
        .json({ error: "You are not a part of this space." });
    }

    const existingUsersChs = await db.user_channel.findAll({
      where: { userId: userIds, channelId: channelId },
    });
    const existingUserIds = existingUsersChs.map((userChs) => userChs.userId);

    const invalidUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId)
    );

    if (invalidUserIds.length > 0) {
      return res
        .status(400)
        .json({ error: "Invalid user IDs", invalidUserIds });
    }

    await space.addMembers(userIds);

    res.json({ message: "Members added successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;

    const channel = await db.channel.findOne({
      where: { id: channelId },
      include: [
        {
          model: db.space,
          as: "spaces",
          include: [
            {
              model: db.user,
              as: "members",
              where: { id: req.user.id },
              attributes: [],
            },
          ],
          attributes: ["id", "name", "type"],
        },
      ],
    });

    if (!channel) {
      return res
        .status(403)
        .json({ error: "Yor are not part of this channel" });
    }

    res.json(channel.spaces);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
