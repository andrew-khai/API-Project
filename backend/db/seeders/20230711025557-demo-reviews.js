'use strict';

const { Review } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 2,
        spotId: 1,
        review: "Good place!",
        stars: 5
      },
      {
        userId: 1,
        spotId: 3,
        review: "Too wet",
        stars: 1
      },
      {
        userId: 3,
        spotId: 2,
        review: "A little dark, but not too bad",
        stars: 3
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {});
  }
};
