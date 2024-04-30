require("dotenv").config();
const crypto = require("crypto");

exports.SHA256_ENC = (data) => {
  const hmac = crypto.createHmac("sha256", process.env.SECRET_KEY);
  hmac.update(data);
  const hash = hmac.digest("hex");
  return hash;
};

exports.GENERATE_TOKEN = (email, id) => {
  let secret_key = process.env.SECRET_KEY;
  let currentTime = Date.now().toString();
  const hash = crypto
    .createHmac("sha256", secret_key)
    .update(email + id + currentTime)
    .digest("hex");
  return hash;
};
