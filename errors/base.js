const { StatusCodes } = require("http-status-codes");

class BaseAPIError extends Error {
  constructor(message) {
    super(message);
    this.status = "Internal Server Error";
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = { BaseAPIError };
