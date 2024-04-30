const Joi = require("joi");

const createChannel_SCH = Joi.object({
  name: Joi.string().min(4).required(),
});

module.exports = {
  createChannel_SCH,
};
