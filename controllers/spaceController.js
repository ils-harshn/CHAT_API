const db = require("../db");
const { SPACE_TYPE } = require("../models/types/Space.types");

const {
  createSpace_SCH,
  addMembersInSpace_SCH,
  create2WAYSpace_SCH,
} = require("../schemas/space");

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
      type: SPACE_TYPE.MANY,
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

    const space = await db.space.findOne({
      where: { id: spaceId },
      include: [
        {
          model: db.user,
          as: "members",
          where: { id: req.user.id },
        },
      ],
    });

    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    if (space.type !== SPACE_TYPE.MANY) {
      return res
        .status(404)
        .json({ error: "Space is not allowed to add members" });
    }

    if (space.channelId !== parseInt(channelId)) {
      return res.status(404).json({ error: "Space not found in this channel" });
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

exports.getMembers = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const spaceId = req.params.spaceId;

    const space = await db.space.findByPk(spaceId);

    if (!space) {
      return res.status(403).json({ error: "Space not found" });
    }

    if (space.channelId !== parseInt(channelId)) {
      return res.status(404).json({ error: "Space not found in this channel" });
    }

    const isMember = await space.hasMember(req.user.id);

    if (!isMember) {
      return res.status(404).json({ error: "Space not found" });
    }

    const members = await space.getMembers({
      attributes: ["id", "email"],
      joinTableAttributes: [],
    });
    res.json(members);
  } catch (err) {
    next(err);
  }
};

exports.create2WAY = async (req, res, next) => {
  try {
    const { error, value } = create2WAYSpace_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }

    const { userId } = value;

    const channelId = req.params.channelId;
    const channel = await db.channel.findByPk(channelId);

    if (!channel) {
      return res.status(403).json({ error: "Channel not found" });
    }

    const userIds = [req.user.id, userId];

    const isAllMembers = await channel.hasMembers(userIds);

    if (!isAllMembers) {
      return res.status(403).json({ error: "Invalid user IDs given." });
    }

    const ex_space = await channel.getSpaces({
      where: { type: SPACE_TYPE.TWO_WAY },
      include: [
        {
          model: db.user,
          as: "members",
          where: { id: userIds },
          through: { attributes: [] },
        },
      ],
      group: ["Space.id"],
      having: db.Sequelize.literal("COUNT(members.id) = 2"),
    });

    if (ex_space.length) {
      return res
        .status(403)
        .json({ error: "Space already exists with these user IDs." });
    }

    const space = await db.space.create({
      name: `${userIds[0]}.${userIds[1]}`,
      channelId: channelId,
      type: SPACE_TYPE.TWO_WAY,
    });

    await space.addMembers(userIds);

    res.json(space);
  } catch (err) {
    next(err);
  }
};
