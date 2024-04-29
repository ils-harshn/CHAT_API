require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// const methodOverride = require("method-override");

const userRoutes = require("./routes/userRoutes");
const requestIp = require("request-ip");
const errorMiddleware = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT;

app.use(requestIp.mw());
app.use(bodyParser.json());

// app.use(methodOverride())

app.use("/users", userRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
