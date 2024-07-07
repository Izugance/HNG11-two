const { StatusCodes } = require("http-status-codes");

const { BaseAPIError } = require("./base.js");

class ResourceNotFoundError extends BaseAPIError {
  constructor(message, status) {
    super(message, status || "Resource Not Found");
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = { ResourceNotFoundError };
