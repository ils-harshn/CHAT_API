require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");

const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(requestIp.mw());
app.use(bodyParser.json());

// routes
app.use("/users", userRoutes);

// middile wares
app.use(errorMiddleware);

// start server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
