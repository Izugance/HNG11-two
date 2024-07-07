const { StatusCodes } = require("http-status-codes");

const { BaseAPIError } = require("./base.js");

class AuthError extends BaseAPIError {
  constructor(message, status, statusCode) {
    super(message || "Authentication failed", status);
    this.statusCode = statusCode || StatusCodes.UNAUTHORIZED;
  }
}

module.exports = { AuthError };
