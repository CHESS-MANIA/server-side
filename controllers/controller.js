const { comparePassword } = require("../helpers/bcrypt");
const { generateToken, signToken } = require("../helpers/jwt");
const { User } = require("../models");

class Controller {
  static async register(req, res) {
    try {
      const { userName, password } = req.body;
      const newRegister = await User.create({ userName, password });
      res
        .status(201)
        .json({ id: newRegister.id, userName: newRegister.userName });
    } catch (error) {
      console.log(error);
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      }
    }
  }

  static async login(req, res) {
    try {
        console.log("masuk login");
      const { userName, password } = req.body;
      if (!userName) {
        throw { code: 400, message: "Username is required" };
      } else if (!password) {
        throw { code: 400, message: "Password is required" };
      }

      const findUser = await User.findOne({ where: { userName } });
      if (!findUser) {
        throw { code: 401, message: "Invalid username or password" };
      }

      const isPasswordSame = comparePassword(password, findUser.password);
      if (!isPasswordSame) {
        throw { code: 401, message: "Invalid username or password" };
      }

      const access_token = signToken({ id: findUser.id });

      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      if (error.hasOwnProperty("code")) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

module.exports = Controller;
