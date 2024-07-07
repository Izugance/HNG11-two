require("dotenv").config();
const { Sequelize } = require("sequelize");

const connectDB = (options) => {
  try {
    const sequelize = new Sequelize(process.env.POSTGRES_URL, {
      logging: false, // Don't log queries.
      dialectModule: require("pg"),
    });
    if (options && options.verbose) {
      console.log("Connected to the database");
    }
    return sequelize;
  } catch (err) {
    console.log(err);
    throw new Error("Could not connect to the database\n" + err.msg);
  }
};

module.exports = { connectDB };
