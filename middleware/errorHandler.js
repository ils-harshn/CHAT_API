function errorMiddleware(error, req, res, next) {
  let status = null;
  let message = null;
  if (error instanceof SyntaxError) {
    message = "Syntax error in request body";
    status = 400;
  } else if (error.name === "ValidationError") {
    status = 422;
    message = "Validation error";
  } else {
    status = 500;
    message = "Internal Server Error";
  }
  res.status(status).json({
    error: error.message,
    message,
  });
}

module.exports = errorMiddleware;
