const { StatusCodes } = require("http-status-codes");
const { ValidationError } = require("sequelize");

const { toTitleCase } = require("../utils/toTitleCase.js");

const controllerErrorHandler = (err, req, res, next) => {
  const error = {
    message:
      err.message ||
      "Something went wrong. Please check arguments and try again",
    status: err.status || "Server Error",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === "SequelizeUniqueConstraintError") {
    error.message = "Duplicate Creation Attempt";
    error.status = "Bad Request";
    error.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.name === "SequelizeForeignKeyConstraintError") {
    const fkey = err.parent.constraint.split("_")[1];
    const model = toTitleCase(fkey.slice(0, -2));
    error.message = `${model} with provided id doesn't exist`;
    error.status = "Not Found";
    error.statusCode = StatusCodes.NOT_FOUND;
  } else if (err instanceof ValidationError) {
    const errors = err.errors.map((errorItem) => {
      return { field: errorItem.path, message: errorItem.message };
    });
    const validationErrorPayload = { errors };
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json(validationErrorPayload);
  }

  return res.status(error.statusCode).json(error);
};

module.exports = { controllerErrorHandler };
