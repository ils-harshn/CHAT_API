const db = require("../db");

const authMiddleware = async (req, res, next) => {
  const tid = req.headers["tid"];
  const uid = req.headers["uid"];
  const authorization = req.headers["authorization"];

  if (tid && uid && authorization && authorization.startsWith("Bearer ")) {
    const req_token = authorization.substring(7, authorization.length);
    const user = await db.user.findByPk(uid);
    const token = await db.token.findByPk(tid);

    if (
      user &&
      token &&
      user.id === token.userId &&
      req_token === token.token
    ) {
      if (user.is_active === false) {
        return res.status(403).json({ message: "Inactive user." });
      }

      if (user.is_verified === false) {
        return res.status(403).json({ message: "User not verified yet." });
      }

      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "Invalid Access Token." });
    }
  } else {
    return res.status(403).json({ message: "Invalid Access Token." });
  }
};

module.exports = authMiddleware;
