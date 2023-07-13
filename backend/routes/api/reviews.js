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
    // console.log(user)
    const userReviews = await Review.findAll({
      include: [
        {
          model: Spot
        },
        // {
        //   model: ReviewImage
        // }
      ],
      where: {
        userId: user
      }
    })

    res.json({
      Reviews: userReviews
    })
  }
)



module.exports = router;
