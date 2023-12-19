const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    let token = req.headers.authorization;
    console.log(token, ">> ini token ada di authen");
    if (!token) {
      throw { name: "Invalid Token" };
    }
    if (token.slice(0, 7) !== "Bearer ") {
      throw { name: "Invalid Token" };
    }

    token = token.slice(7);

    let payload = verifyToken(token);

    let user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "Invalid Token" };
    }

    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    console.log(error);
    if (error.name === "Invalid Token" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json(error);
  }
}

module.exports = authentication;
