const http = require("http");

require("dotenv").config();
const asyncHandler = require("express-async-handler");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");

const { sequelize, models } = require("./models");
const {
  controllerErrorHandler,
} = require("./middleware/controller-error-handler.js");
const { endpoint404Handler } = require("./middleware/endpoint-not-found.js");

const app = express();

// -----Pre-route middleware-----
function initPreRouteMiddleware() {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(xssClean());
}

// -----Routes-----
function initRoutes() {
  const { authRouter, userRouter, organisationRouter } = require("./routes");

  const apiRoot = "/api";
  app.use(apiRoot + "/auth", authRouter);
  app.use(apiRoot + "/users", userRouter);
  app.use(apiRoot + "/organisations", organisationRouter);
  app.get(
    apiRoot + "/",
    asyncHandler(async (req, res) => {
      res.status(StatusCodes.OK).send("HNG11 stage 2 API");
    })
  );
}

// -----Post-route middleware-----
function initPostRouteMiddleware() {
  // DO ME!!!
  app.use(controllerErrorHandler);
  app.use(endpoint404Handler);
}

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

async function serve() {
  try {
    // await sequelize.sync({ force: true, logging: false });
    await sequelize.sync({ logging: false });
    console.log("Models synchronized");
    initPreRouteMiddleware();
    initRoutes();
    initPostRouteMiddleware();
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
    // Seed users.
    // let users = [];
    // for (let i = 1; i <= 3; i++) {
    //   users.push({
    //     id: i,
    //     email: "test" + i + "@test.com",
    //     username: "test" + i,
    //     firstName: "Test",
    //     lastName: "User",
    //     password: "test",
    //   });
    // }
    // await models.User.bulkCreate(users, { individualHooks: true });
  } catch (err) {
    // throw new Error("Could not start-up server\n" + `Reason: ${err.message}`);
    console.error(err);
  }
}

serve();
