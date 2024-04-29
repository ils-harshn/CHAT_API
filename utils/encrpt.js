require("dotenv").config();
const crypto = require("crypto");

exports.SHA256_ENC = (data) => {
  const hmac = crypto.createHmac("sha256", process.env.SECRET_KEY);
  hmac.update(data);
  const hash = hmac.digest("hex");
  return hash;
};
