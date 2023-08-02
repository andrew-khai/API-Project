const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check, query } = require('express-validator');
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
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage(`Latitude is not valid`),
  check('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage(`Longitude is not valid`),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required'),
  check('name')
    .isLength({ max: 50 })
    .withMessage(`Name must be less than 50 characters`),
  handleValidationErrors
]

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage(`Review text is required`),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage(`Stars must be an integer from 1 to 5`),
  handleValidationErrors
]

const validateQuery = [
  query('page')
    // .optional()
    .default(1)
    .isInt({ min: 1, max: 10 })
    .withMessage('Page must be greater than or equal to 1'),
  // add other check for when page and size are over max value
  query('size')
    // .optional()
    .default(20)
    .isInt({ min: 1, max: 20 })
    .withMessage('Size must be greater than or equal to 1'),
  query('minLat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  query('maxLat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  query('minLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  query('maxLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors
]

const getFloatMinMaxClause = (min, max) => {
  if (min && max) {
    return {
      [Op.and]: [
        { [Op.gte]: parseFloat(min) },
        { [Op.lte]: parseFloat(max) }
      ]
    };
  }
  if (min) {
    return {
      [Op.gte]: parseFloat(min)
    };
  }
  if (max) {
    return {
      [Op.lte]: parseFloat(max)
    };
  }
  return;
}

const generateWhereObj = (query) => {
  const where = {};

  if (!query) return where;
  if (query.minLat || query.maxLat) {
    where.lat = getFloatMinMaxClause(query.minLat, query.maxLat);
  }
  if (query.minLng || query.maxLng) {
    where.lng = getFloatMinMaxClause(query.minLng, query.maxLng);
  }
  if (query.minPrice || query.maxPrice) {
    where.price = getFloatMinMaxClause(query.minPrice, query.maxPrice);
  }

  return where;
}
//Get ALL Spots
router.get(
  '',
  validateQuery,
  async (req, res) => {
    let pagination = { limit: 20, offset: 0 };
    let { page, size
      // , minLat, maxLat, minLng, maxLng, minPrice, maxPrice
    } = req.query;

    page = parseInt(page);
    size = parseInt(size);
    if (size) pagination.limit = size;
    if (page) pagination.offset = size * (page - 1);

    const where = generateWhereObj(req.query);

    console.log(where)


    // console.log('size', typeof size)
    // console.log('page', typeof page)
    // if (!page) page = 1;
    // if (!size) size = 20;

    // if (page >= 10) {
    //   page = 10;
    // }
    // if (size >= 20) {
    //   pagination.limit = 20;
    // }
    // if (page >= 1 && size >= 1) {
    //   pagination.limit = size;
    //   pagination.offset = size * (page - 1);
    // }
    // if (!page || !size) {
    //   pagination.limit = 20;
    // }
    // if (pagination.offset === 0) {
    //   pagination.offset = 1;
    // }

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
      ],
      where,
      ...pagination
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
        } else {
          spot.previewImage = "no preview"
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


    res.json({
      Spots: allSpots,
      // ...pagination,
      page,
      size
    })
  }
);

//Get all Spots for Current User
router.get(
  '/current',
  requireAuth,
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
        } else {
          spot.previewImage = 'No preview'
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
  requireAuth,
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
      // console.log(image.spotId)
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

//Get All Reviews by Spot ID
router.get(
  '/:spotId/reviews',
  async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ],
      where: {
        spotId: req.params.spotId
      }
    })
    if (!spot) {
      res.status(404);
      return res.json({
        message: `Spot couldn't be found`
      })
    }
    res.json({
      Reviews: reviews
    })
  }
)

//Create a Review for Spot based on Spot's ID
router.post(
  '/:spotId/reviews',
  validateReview,
  requireAuth,
  async (req, res) => {
    const userId = req.user.id
    // if (!user) {
    //   res.status(401);
    //   return res.json({
    //     message: "Authetication required"
    //   })
    // }
    const spotId = req.params.spotId;
    const { review, stars } = req.body
    let spot = await Spot.findByPk(req.params.spotId, {
      include: [
        {
          model: Review
        }
      ]
    });
    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }
    let reviewedBy = []
    spot.Reviews.forEach(review => {
      // console.log(review.userId)
      reviewedBy.push(review.userId)
      if (userId === review.userId) {
        res.status(500);
        return res.json({
          message: "User already has a review for this spot"
        })
      }
    })
    // console.log('reviewed', reviewedBy)
    if (userId === spot.ownerId) {
      res.status(403);
      return res.json({
        message: "Owner cannot submit review"
      })
    }
    if (!reviewedBy.includes(userId)) {
      let userReview = await Review.create({ userId, spotId, review, stars });
      // console.log(userReview.id)
      const newReview = {
        id: userReview.id,
        userId: userId,
        spotId: spot.id,
        review: userReview.review,
        stars: userReview.stars
      }

      return res.json(userReview)
    }

  }
)

//Get All Bokings for a Spot based on Spot ID
router.get(
  '/:spotId/bookings',
  requireAuth,
  async (req, res) => {
    const user = req.user.id
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
      res.status(404);
      return res.json({
        message: `Spot couldn't be found`
      })
    }
    if (user === spot.ownerId) {
      const booking = await Booking.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        where: {
          spotId: spot.id
        }
      })
      return res.json({
        Bookings: booking
      })
    }
    if (user !== spot.ownerId) {
      const booking = await Booking.findAll({
        attributes: ['spotId', 'startDate', 'endDate'],
        where: {
          spotId: spot.id
        }
      })
      return res.json({
        Bookings: booking
      })
    }
  }
)

//Create a Booking for a Spot based on Spot ID
router.post(
  '/:spotId/bookings',
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;
    // console.log(user)
    const spot = await Spot.findByPk(req.params.spotId, {
      include: [
        {
          model: Booking
        }
      ]
    });
    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }
    if (userId === spot.ownerId) {
      res.status(403)
      return res.json({
        message: "User owns this spot"
      })
    }
    const { startDate, endDate } = req.body;
    // console.log('start from booking', startDate)
    // console.log('end from booking', endDate)
    const startDateString = new Date(startDate).toDateString()
    // console.log('start', startDateString)
    const startDateObj = new Date(startDateString).getTime()
    // console.log('start', startDateObj)
    const endDateString = new Date(endDate).toDateString()
    // console.log('end', endDateString)
    const endDateObj = new Date(endDateString).getTime()
    // console.log('end', endDateObj)
    // console.log(spot)
    if (startDateObj >= endDateObj) {
      res.status(400);
      return res.json({
        message: "endDate cannot be on or before startdate"
      })
    }
    if (startDateObj < new Date().getTime() || endDateObj < new Date().getTime()) {
      res.status(403);
      return res.json({
        message: "Start or End date cannot be before current day"
      })
    }
    // console.log('bookings', spot.Bookings);
    // spot.Bookings.forEach(booking => {
    //   // console.log('booking start', booking.startDate.getTime())
    //   // console.log('booking end', booking.endDate)
    //   let startDate = booking.startDate.getTime();
    //   let endDate = booking.endDate.getTime();
    //   if (startDateObj >= startDate && startDateObj <= endDate) {
    //     res.status(403);
    //     return res.json({
    //       message: "Sorry, this spot is already booked for the specified dates",
    //       errors: {
    //         startDate: "Start date conflicts with an existing booking"
    //       }
    //     })
    //   }
    //   else if (endDateObj >= startDate && endDateObj <= endDate) {
    //     res.status(403);
    //     return res.json({
    //       message: "Sorry, this spot is already booked for the specified dates",
    //       errors: {
    //         endDate: "End date conflicts with an existing booking"
    //       }
    //     })
    //   }
    // })
    for (let i = 0; i < spot.Bookings.length; i++) {
      let booking = spot.Bookings[i];
      console.log(typeof booking.startDate)
      let startDate = booking.startDate.getTime();
      let endDate = booking.endDate.getTime();
      if ((startDateObj >= startDate && startDateObj <= endDate) && (endDateObj >= startDate && endDateObj <= endDate)) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
          }
        })
      }
      if (startDateObj >= startDate && startDateObj <= endDate) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking"
          }
        })
      }
      if (endDateObj >= startDate && endDateObj <= endDate) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            endDate: "End date conflicts with an existing booking"
          }
        })
      }
    }

    let spotId = spot.id

    const userBooking = await Booking.create({ spotId, userId, startDate, endDate })
    const newBooking = {
      id: userBooking.id,
      spotId: spotId,
      userId: userId,
      startDate: userBooking.startDate,
      endDate: userBooking.endDate
    }
    // console.log('spot', spot.Bookings)
    return res.json(userBooking)

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
  requireAuth,
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

      return res.json(spot)
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
  requireAuth,
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
  requireAuth,
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
