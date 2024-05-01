require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");

const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");
const channelRoutes = require("./routes/channelRoutes");
const spaceRoutes = require("./routes/spaceRoutes");
const checkXApiKeyMiddleware = require("./middleware/headerCheckHandler");

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(requestIp.mw());
app.use(bodyParser.json());
app.use(checkXApiKeyMiddleware);

// routes
app.use("/users", userRoutes);
app.use("/channel", channelRoutes);
app.use("/space", spaceRoutes);

// middile wares
app.use(errorMiddleware);

// start server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
