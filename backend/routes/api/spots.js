const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage(`Street address is required`),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage(`City is required`),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage(`State is required`),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage(`Country is required`),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage(`Description is required`),
  check('price')
    .isInt({ min: 1 })
    .withMessage(`Price per day is required`),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage(`Latitude is not valid`),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage(`Longitude is not valid`),
  check('name')
    .isLength({ max: 50 })
    .withMessage(`Name must be less than 50 characters`),
  handleValidationErrors
]

//Get ALL Spots
router.get(
  '',
  async (req, res) => {
    const spots = await Spot.findAll({
      include: [
        {
          model: Review,
          // attributes: []
          // include: [
          //   {
          //     model: ReviewImage,
          //     attributes: ['previewImage']
          //   }
          // ]
        },
        {
          model: SpotImage
        }
      ]
      // attributes: [
      //   [sequelize.fn('AVG', sequelize.col('stars')),
      //     'avgRating']
      // ],
      // raw: true
    });
    // const reviews = await Review.findAll({
    // })

    let allSpots = [];
    spots.forEach(spot => {
      allSpots.push(spot.toJSON())
    })
    // console.log(allSpots)
    allSpots.forEach(spot => {
      let total = 0;
      spot.Reviews.forEach(review => {
        // console.log(review)
        total += review.stars
      })
      spot.SpotImages.forEach(spotImage => {
        // console.log(spotImage)
        if (spotImage.preview) {
          spot.previewImage = spotImage.url
        }
      })
      spot.avgRating = total / spot.Reviews.length
      delete spot.Reviews
      delete spot.SpotImages
    })

    // const reviews = spots.Reviews;

    // const totalReviewStars = await Review.sum('stars')
    // const reviewCount = await Review.count()
    // const avgRating = totalReviewStars / reviewCount


    res.json({ Spots: allSpots })
  }
);

//Get all Spots for Current User
router.get(
  '/current',
  async (req, res) => {
    const user = req.user.id
    const userSpots = await Spot.findAll({
      include: [
        {
          model: Review
        },
        {
          model: SpotImage
        }
      ],
      where: {
        ownerId: user
      }
    })
    let allSpots = [];
    userSpots.forEach(spot => {
      allSpots.push(spot.toJSON())
    })
    allSpots.forEach(spot => {
      let total = 0;
      spot.Reviews.forEach(review => {
        total += review.stars
      })
      spot.SpotImages.forEach(spotImage => {
        // console.log(spotImage)
        if (spotImage.preview) {
          spot.previewImage = spotImage.url
        }
      })
      spot.avgRating = total / spot.Reviews.length
      delete spot.Reviews
      delete spot.SpotImages
    })
    if (userSpots && userSpots.length !== 0) {
      res.json({
        Spots: allSpots
      })
    } else {
      res.status(404);
      return res.json({
        message: `No spots owned`
      })
    }
  }
)

//Add an Image to a Spot
router.post(
  '/:spotId/images',
  async (req, res) => {
    const ownerId = req.user.id
    if (!ownerId) {
      res.status(401);
      return res.json({
        message: "Authentication required"
      })
    }
    const { url, preview } = req.body;
    let spot = await Spot.findByPk(req.params.spotId, {
      include: [
        {
          model: SpotImage
        }
      ]
    });
    // console.log('spot', spot)
    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }
    // console.log('owner', spot.ownerId)
    if (ownerId !== spot.ownerId) {
      res.status(403);
      return res.json({
        message: "Forbidden"
      })
    }
    if (ownerId === spot.ownerId) {
      // console.log(spot.ownerId)
      let spotId = spot.id;
      let image = await SpotImage.create({ spotId, url, preview });
      console.log(image.spotId)
      const newImage = {
        id: image.id,
        spotId: spot.id,
        url: image.url,
        preview: image.preview
      }

      res.json(newImage)
    }
    // console.log(spot.SpotImages)
  }
)

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
        },
        {
          model: Review,
        }
      ]
    })
    if (!spot) {
      res.status(404)
      return res.json({
        message: `Spot couldn't be found`
      })
    }
    let currentSpot = spot.toJSON();

    currentSpot.Owner = currentSpot.User;
    delete currentSpot.User;

    let reviews = spot.Reviews;
    // console.log(spot.Reviews)
    let numReviews = reviews.length;
    // console.log(reviewCount)
    let total = 0;
    let totalReviewStars = reviews.forEach(review => {
      total += review.stars;
    })
    // console.log(total)
    currentSpot.numReviews = numReviews;
    currentSpot.avgStarRating = total / numReviews;
    // console.log(avgStarRating)
    delete currentSpot.Reviews

    // console.log(currentSpot)
    res.json(currentSpot)
  }
)

//Create a Spot
router.post(
  '',
  validateSpot,
  async (req, res) => {
    const ownerId = req.user.id;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    if (ownerId) {
      const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

      const newSpot = {
        id: spot.id,
        ownerId: ownerId,
        address: spot.address,
        city: spot.city,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price
      }

      return res.json(newSpot)
    } else {
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    }
  }
)

//EDIT a Spot
router.put(
  '/:spotId',
  validateSpot,
  async (req, res) => {
    const ownerId = req.user.id
    // console.log(user);
    if (!ownerId) {
      res.status(401);
      return res.json({
        message: "Authentication required"
      })
    }
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }
    // console.log('spot ownerId', spot.ownerId)
    if (ownerId !== spot.ownerId) {
      res.status(403);
      return res.json({
        message: "Forbidden"
      })
    }
    // console.log('spot before', spot)
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    if (ownerId === spot.ownerId) {
      if (address) spot.address = address;
      if (city) spot.city = city;
      if (state) spot.state = state;
      if (country) spot.country = country;
      if (lat) spot.lat = lat;
      if (lng) spot.lng = lng;
      if (name) spot.name = name;
      if (description) spot.description = description;
      if (price) spot.price = price;
    }

    await spot.save()
    // console.log('spot after', spot)

    res.json(spot)
  }
)

//DELETE a Spot
router.delete(
  '/:spotId',
  async (req, res) => {
    const ownerId = req.user.id
    // console.log(user);
    if (!ownerId) {
      res.status(401);
      return res.json({
        message: "Authentication required"
      })
    }
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }
    if (ownerId !== spot.ownerId) {
      res.status(403);
      return res.json({
        message: "Forbidden"
      })
    }

    if (ownerId === spot.ownerId) {
      await spot.destroy()
    }
    res.json({
      message: "Successfully deleted"
    })
  }
)

module.exports = router;
