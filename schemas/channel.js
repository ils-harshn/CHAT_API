const Joi = require("joi");

const createChannel_SCH = Joi.object({
  name: Joi.string().min(4).required(),
});

const addMembersInChannel_SCH = Joi.object({
  userIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
});

module.exports = {
  createChannel_SCH,
  addMembersInChannel_SCH,
};
