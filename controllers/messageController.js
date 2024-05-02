const db = require("../db");
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
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const totalMessagesCount = await space.countMessages();

    const offset = Math.max(0, totalMessagesCount - page * limit);

    const messages = await space.getMessages({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};
