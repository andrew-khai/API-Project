const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage(`Review text is required`),
  check('stars')
    .isInt({min: 1, max: 5})
    .withMessage(`Stars must be an integer from 1 to 5`),
  handleValidationErrors
]

//GET ALL Reviews of Current User
router.get(
  '/current',
  async (req, res) => {
    const user = req.user.id
    // console.log(user)
    const userReviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: SpotImage
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ],
      where: {
        userId: user
      }
    })

    let allReviews = [];
    // console.log(userReviews)
    userReviews.forEach(review => {
      allReviews.push(review.toJSON())
    })
    // console.log(allReviews)
    allReviews.forEach(review => {
      // console.log(review)
      // console.log(review.Spot.SpotImages)
      review.Spot.SpotImages.forEach(spotImage => {
        console.log(spotImage)
        // console.log('preview', spotImage.preview)
        if (spotImage.preview) {
          review.Spot.previewImage = spotImage.url
        }
      })
      delete review.Spot.SpotImages
    })

    res.json({
      Reviews: allReviews
    })
  }
)

//Edit a Review
router.put(
  '/:reviewId',
  validateReview,
  async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
      res.status(401);
      return res.json({
        message: "Authentication required"
      })
    }

    let userReview = await Review.findByPk(req.params.reviewId);
    if (!userReview) {
      res.status(404)
      return res.json({
        message: "Review couldn't be found"
      })
    }
    if (userId !== userReview.userId) {
      res.status(403);
      return res.json({
        message: "Forbidden"
      })
    }

    const { review, stars } = req.body
    if (userId === userReview.userId) {
      if (review) userReview.review = review;
      if (stars) userReview.stars = stars;
    }

    await userReview.save()

    res.json(userReview)
  }
)



module.exports = router;
