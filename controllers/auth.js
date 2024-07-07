const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { ValidationError } = require("sequelize");

const { sequelize, models } = require("../models");
const { toTitleCase } = require("../utils/toTitleCase.js");
const { AuthError, BadRequestError } = require("../errors");

const User = models.User;

/** POST */
const register = asyncHandler(async (req, res, next) => {
  let { email, firstName, lastName, password, phone } = req.body;

  email =
    email !== null && email !== undefined ? email.trim().toLowerCase() : email;
  firstName =
    firstName !== null && firstName !== undefined
      ? toTitleCase(firstName)
      : firstName;
  lastName =
    lastName !== null && lastName !== undefined
      ? toTitleCase(lastName)
      : lastName;
  password = (password && password.trim()) || null;
  phone = (phone && phone.trim()) || null;

  const payload = {
    status: "success",
    message: "Registration successful",
    data: {},
  };

  try {
    await sequelize.transaction(async (t) => {
      const user = await User.create({
        email,
        firstName,
        lastName,
        password,
        phone,
      });

      payload.data.accessToken = user.genJWT();
      payload.data.user = user.toJSON();

      await user.createOrganisation({
        name: firstName + "'s " + "Organisation",
      });
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      next(err);
      return;
    }
    throw new BadRequestError("Registration Unsuccessful");
  }

  res.status(StatusCodes.CREATED).json(payload);
});

/** POST */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
    attributes: { exclude: ["password"] },
  });
  if (!user && (await user.verifyPassword(password.trim()))) {
    throw new AuthError(null, "Bad Request");
  }

  const payload = {
    status: "success",
    message: "Login Successful",
    data: {
      accessToken: await user.genJWT(),
      user: user.toJSON(),
    },
  };
  res.status(StatusCodes.OK).json(payload);
});

module.exports = { register, login };
