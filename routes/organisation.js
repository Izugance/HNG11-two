const express = require("express");

const { userAuthMiddleware } = require("../middleware/auth.js");
const {
  getUserOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
} = require("../controllers/organisation.js");

const organisationRouter = express.Router();

organisationRouter
  .route("/")
  .get(userAuthMiddleware, getUserOrganisations)
  .post(userAuthMiddleware, createOrganisation);

organisationRouter.route("/:orgId").get(userAuthMiddleware, getOrganisation);

organisationRouter.route("/:orgId/users").post(addUserToOrganisation);

module.exports = { organisationRouter };
