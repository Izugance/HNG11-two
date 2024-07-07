const express = require("express");

const { getUserById } = require("../controllers/user.js");

const userRouter = express.Router();

userRouter.route("/:id").get(getUserById);

module.exports = { userRouter };
