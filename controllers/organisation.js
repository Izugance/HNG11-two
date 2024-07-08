const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const { sequelize, models } = require("../models");
const {
  AuthError,
  BadRequestError,
  ResourceNotFoundError,
} = require("../errors");

const User = models.User;
const Organisation = models.Organisation;

/** GET
 * Gets all organisations the user belongs to or created. If a
 * user is logged in properly, they can get all their organisations.
 */
const getUserOrganisations = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.userId);
  const organisations = await user.getOrganisations({
    joinTableAttributes: [],
  });
  organisations.forEach((organisation) => {
    return organisation.toJSON();
  });

  const payload = {
    status: "success",
    message: "All Organisations For Logged In User",
    data: {
      organisations,
    },
  };
  res.status(StatusCodes.OK).json(payload);
});

/** GET */
const getOrganisation = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.userId);
  const organisation = await user.getOrganisations({
    where: {
      orgId: req.params.orgId,
    },
    joinTableAttributes: [],
  });
  if (!organisation) {
    throw new ResourceNotFoundError("Resource not found", "Client error");
  }

  console.log(organisation[0].toJSON());
  const payload = {
    status: "success",
    message: "Organisation Found",
    data: organisation.toJSON(),
  };
  console.log(payload);
  res.status(StatusCodes.OK).json(payload);
});

/** POST */
const createOrganisation = asyncHandler(async (req, res) => {
  let organisation;
  try {
    organisation = await Organisation.create({
      name: req.body.name || req.user.firstName + "'s " + "Organisation",
      description: req.body.description,
    });
  } catch (err) {
    throw new BadRequestError();
  }

  const payload = {
    status: "success",
    message: "Organisation created successfully",
    data: organisation.toJSON(),
  };
  res.status(StatusCodes.CREATED).json(payload);
});

/** POST */
const addUserToOrganisation = asyncHandler(async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.orgId);
    organisation.addUser({ userId: req.body.userId });
  } catch (err) {
    throw new BadRequestError();
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "User added to organisation successfully",
  });
});

module.exports = {
  getUserOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
};
