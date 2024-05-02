const Joi = require("joi");

const createMessage_SCH = Joi.object({
  message: Joi.string().required().trim().min(1),
});

module.exports = {
  createMessage_SCH,
};
