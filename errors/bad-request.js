const { StatusCodes } = require("http-status-codes");

const { BaseAPIError } = require("./base.js");

class BadRequestError extends BaseAPIError {
  constructor(message, status) {
    super(message || "Client error", status || "Bad Request");
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = { BadRequestError };
