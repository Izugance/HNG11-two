const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User extends Model {
  genJWT() {
    return jwt.sign(
      { userId: this.userId, firstName: this.firstName },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );
  }
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

function initUser(sequelize, DataTypes) {
  User.init(
    {
      userId: {
        // must be unique
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        // must not be null
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        // must not be null
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        // must be unique and must not be null
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        // must not be null
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        // allowNull: false
      },
    },
    {
      sequelize,
      timestamps: false,
      hooks: {
        beforeSave: async (user, options) => {
          const salt = await bcrypt.genSalt();
          user.password = await bcrypt.hash(user.password, salt);
        },
      },
    }
  );

  User.associate = function (models) {
    User.belongsToMany(models.Organisation, { through: "Users_Organisations" });
  };

  return User;
}

module.exports = { initUser };
