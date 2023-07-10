'use strict';

const { Spot } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2,
        address: "0001 Milky Way Lane",
        city: "Moon City",
        state: "Space",
        country: "Galaxy",
        lat: 38.7645358,
        lng: -121.4730327,
        name: "Black Hole",
        description: "Very quiet and spacious home. Gets really dark at night...and during the day.",
        price: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3,
        address: "10 Seaside Lane",
        city: "City of Atlantis",
        state: "Atlantis",
        country: "United States of America",
        lat: -26.6841201,
        lng: -122.0173401,
        name: "Atlantis",
        description: "Come swim with the fishes...if you dare.",
        price: 75000,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'Black Hole', 'Atlantis']}
    }, {});
  }
};
