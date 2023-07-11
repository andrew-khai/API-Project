const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [
  check('address')
  .exists({ checkFalsy: true})
  .withMessage(`Street address is required`),
  check('city')
  .exists({ checkFalsy: true})
  .withMessage(`City is required`),
  check('state')
  .exists({ checkFalsy: true})
  .withMessage(`State is required`),
  check('country')
  .exists({ checkFalsy: true})
  .withMessage(`Country is required`),
  check('description')
  .exists({ checkFalsy: true})
  .withMessage(`Description is required`),
  check('price')
  .exists({ checkFalsy: true})
  .withMessage(`Price per day is required`),
  check('price')
  .not()
  .isInt()
  .withMessage(`Enter a valid price`),
  check('lat')
  .not()
  .isDecimal()
  .withMessage(`Latitude is not valid`),
  check('lng')
  .not()
  .isDecimal()
  .withMessage(`Longitude is not valid`),
]

//Get ALL Spots
router.get(
  '',
  async (req, res) => {
    const spots = await Spot.findAll({
      // include: {
      //   model: Review,
      //   attributes: []
      // },
      // attributes: [
      //   [sequelize.fn('AVG', sequelize.col('stars')),
      //     'avgRating']
      // ],
      // raw: true
    });

    res.json(spots)
  }
);

//Get details of a Spot from an ID
router.get(
  '/:spotId',
  async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview']
        }
      ]
    })
    if (!spot) {
      res.status(404)
      return res.json({
        message: `Spot couldn't be found`
      })
    }
    res.json(spot)
  }
)

//Create a Spot
router.post(
  '',
  validateSpot,
  async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({ address, city, state, country, lat, lng, name, description, price });

    const newSpot = {
      address: spot.address,
      city: spot.city,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price
    }

    return res.json({
      newSpot
    })
  }
)

module.exports = router;
