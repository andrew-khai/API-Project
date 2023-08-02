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
        url: "/images/spot-1/matterhornbasketballcourt.png",
        preview: true
      },
      {
        spotId: 2,
        url: "/images/spot-2/space-basketball-preview.png",
        preview: true
      },
      {
        spotId: 2,
        url: "/images/spot-2/space-basketball-1.png",
        preview: false
      },
      {
        spotId: 2,
        url: "/images/spot-2/space-basketball-2.png",
        preview: false
      },
      {
        spotId: 2,
        url: "/images/spot-2/space-basketball-3.png",
        preview: false
      },
      {
        spotId: 2,
        url: "/images/spot-2/space-basketball-4.png",
        preview: false
      },
      {
        spotId: 3,
        url: "/images/spot-3/scubadunks.png",
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
