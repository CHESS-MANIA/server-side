"use strict";

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dataUser = require("../data/user.json").map((item) => {
      item.createdAt = new Date();
      item.updatedAt = new Date();
      item.password = hashPassword(item.password);

      return item;
    });
    return await queryInterface.bulkInsert("Users", dataUser);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Users", null, {});
  },
};
