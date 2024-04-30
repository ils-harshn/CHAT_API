require("dotenv").config();

const checkXApiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.X_API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
};

module.exports = checkXApiKeyMiddleware;
