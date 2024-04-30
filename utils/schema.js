const Joi = require("joi");

const signUp_SCH = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    }),
});

const verifyOTP_SCH = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base":
        "OTP must be at 6 digit number string",
    }),
});

module.exports = {
  signUp_SCH,
  verifyOTP_SCH,
};
