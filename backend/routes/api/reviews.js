const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//GET ALL Reviews of Current User
router.get(
  '/current',
  async (req, res) => {
    const user = req.user.id
    console.log(user)
    const userReviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price'],
          include: {
            model: SpotImage
          }
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
    userReviews.forEach(review => {
      allReviews.push(review.toJSON())
    })
    // console.log(allReviews)
    allReviews.forEach(review => {
      review.Spot.SpotImages.forEach(spotImage => {
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



module.exports = router;
