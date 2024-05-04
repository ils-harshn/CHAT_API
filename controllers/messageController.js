const db = require("../db");
const { DB_CONFIG } = require("../db/config");
const { MESSAGE_STATUS_TYPE } = require("../models/types/MessageStatus.types");
const { createMessage_SCH } = require("../schemas/message");

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createMessage_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }

    const { message: content } = value;
    const channelId = req.params.channelId;
    const spaceId = req.params.spaceId;

    const space = await db.space.findByPk(spaceId);

    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    if (space.channelId !== parseInt(channelId)) {
      return res.status(404).json({ error: "Space not found in this channel" });
    }

    const isMember = await space.hasMember(req.user.id);

    if (!isMember) {
      return res.status(404).json({ error: "Space not found" });
    }

    const message = await db.message.create({
      spaceId: space.id,
      message: content,
      userId: req.user.id,
    });

    const memberIds = (await space.getMembers({ attributes: ["id"] })).map(
      (member) => member.id
    );

    const statusData = memberIds.map((memberId) => ({
      messageId: message.id,
      userId: memberId,
      status:
        memberId === req.user.id
          ? MESSAGE_STATUS_TYPE.SEEN
          : MESSAGE_STATUS_TYPE.PENDING,
    }));

    await db.message_status.bulkCreate(statusData);

    res.json(message);
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const spaceId = req.params.spaceId;

    const space = await db.space.findByPk(spaceId);

    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    if (space.channelId !== parseInt(channelId)) {
      return res.status(404).json({ error: "Space not found in this channel" });
    }

    const isMember = await space.hasMember(req.user.id);

    if (!isMember) {
      return res
        .status(404)
        .json({ error: "You are not a member of this space" });
    }

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit)
      : DB_CONFIG.PAGE_LIMIT;

    const totalMessagesCount = await space.countMessages();
    const totalPages = Math.ceil(totalMessagesCount / limit);
    const offset = Math.max(0, totalMessagesCount - page * limit);

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    if (page > totalPages || page < 1) {
      return res.status(404).json({
        error: "Page not found.",
        page,
        count: totalMessagesCount,
        totalPages,
        nextPage,
        prevPage,
      });
    }

    const messages = await space.getMessages({
      limit,
      offset,
      include: [
        {
          model: db.message_status,
          as: "status",
          where: { userId: req.user.id },
          required: false,
          attributes: ["status", ["updatedAt", "at"]],
        },
      ],
    });

    // messages.reverse();

    const result = {
      page,
      count: totalMessagesCount,
      messages,
      totalPages,
      nextPage,
      prevPage,
    };

    res.json(result);
  } catch (err) {
    next(err);
  }
};
