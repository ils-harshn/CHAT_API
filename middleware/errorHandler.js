function errorMiddleware(error, req, res, next) {
  let status = null;
  let message = null;
  console.log(error);

  switch (error.name) {
    case "SequelizeUniqueConstraintError":
      message = error.message;
      status = 422;
      break;
    default:
      status = 500;
      message = "Internal Server Error";
  }

  res.status(status).json({
    error: error,
    message,
  });
}

module.exports = errorMiddleware;
