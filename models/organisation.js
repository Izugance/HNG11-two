const { DataTypes } = require("sequelize");

function initOrganisation(sequelize, DataTypes) {
  const Organisation = sequelize.define(
    "Organisation",
    {
      orgId: {
        // Unique
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        // Required and cannot be null
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {}
  );

  Organisation.associate = function (models) {
    Organisation.belongsToMany(models.User, { through: "Users_Organisations" });
  };

  return Organisation;
}

module.exports = { initOrganisation };
