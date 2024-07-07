const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const { models } = require("../models");
const { ResourceNotFoundError } = require("../errors");

const User = models.User;

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.query.id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new ResourceNotFoundError("Resource not found", "Client error");
  }

  const payload = {
    status: "success",
    message: "User Found",
    data: user.toJSON(),
  };
  res.status(StatusCodes.OK).json(payload);
});

module.exports = { getUserById };
