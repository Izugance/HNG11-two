const { DataTypes } = require("sequelize");

const { connectDB } = require("../config/db.js");
const { initUser } = require("./user.js");
const { initOrganisation } = require("./organisation.js");

const sequelize = connectDB({ verbose: true });
const modelInits = [initUser, initOrganisation];
const models = {};

// Initialize models.
modelInits.forEach((init) => {
  const model = init(sequelize, DataTypes);
  models[model.name] = model;
});

// Associate models.
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, models };
