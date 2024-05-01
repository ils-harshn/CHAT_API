const Joi = require("joi");

const createSpace_SCH = Joi.object({
  name: Joi.string().min(4).required(),
});

const addMembersInSpace_SCH = Joi.object({
  userIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
});

module.exports = { addMembersInSpace_SCH, createSpace_SCH };
