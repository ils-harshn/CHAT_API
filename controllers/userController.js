const db = require("../db");
const { signUp_SCH } = require("../utils/schema");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.user.findAll();
    res.json({
      users,
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { error, value } = signUp_SCH.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error, message: error.message });
    }
    const newUser = await db.user.create(value);
    res.json(value);
  } catch (err) {
    next(err);
  }
};
