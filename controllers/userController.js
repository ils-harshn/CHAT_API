const db = require("../db");

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

exports.signup = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ error: err, message: err.message });
  }
};
