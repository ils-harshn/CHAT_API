const Joi = require("joi");

const createSpace_SCH = Joi.object({
  name: Joi.string().min(4).required(),
});

module.exports = { createSpace_SCH };
