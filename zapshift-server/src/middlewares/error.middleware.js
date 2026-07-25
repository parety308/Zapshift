import env from "../config/env.js";

// Central error handler. http-errors instances (thrown via createHttpError)
// carry .status and .message; MySQL duplicate-key errors are translated to
// a friendly 409.
export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "Something went wrong on the server";

  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "A record with this value already exists.";
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_ROW_IS_REFERENCED_2") {
    statusCode = 400;
    message = "This action violates a database relationship constraint.";
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
