'use strict';
const { SpotImage } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dtylyepxs/image/upload/v1691009592/BallBnB/matterhornbasketballcourt_luonjp.webp",
        preview: true
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dtylyepxs/image/upload/v1691009608/BallBnB/space-basketball-pre_yz2dvd.png",
        preview: true
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dtylyepxs/image/upload/v1691009612/BallBnB/space-basketball-1_kjqwsj.png",
        preview: false
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dtylyepxs/image/upload/v1691009610/BallBnB/space-basketball-2_jznees.png",
        preview: false
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dtylyepxs/image/upload/v1691009610/BallBnB/space-basketball-3_rciaab.png",
        preview: false
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dtylyepxs/image/upload/v1691009610/BallBnB/space-basketball-4_rwvdrx.png",
        preview: false
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dtylyepxs/image/upload/v1691009625/BallBnB/scubadunks_orhmd6.webp",
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {});
  }
};
