"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Username is required",
          },
          notNull: {
            message: "Username is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Password is required",
          },
          notNull: {
            message: "Password is required",
          },
          len: {
            args: [5],
            message: "Minimal password is 5 characters",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate(async (user, options) => {
    const hashedPassword = hashPassword(user.password);
    user.password = hashedPassword;
  });

  return User;
};
