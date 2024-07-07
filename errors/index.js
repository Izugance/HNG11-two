const { BadRequestError } = require("./bad-request.js");
const { AuthError } = require("./auth.js");
const { ResourceNotFoundError } = require("./resource-not-found.js");

module.exports = { BadRequestError, AuthError, ResourceNotFoundError };
