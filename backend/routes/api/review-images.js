const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Delete Review Image by ID
router.delete(
  '/:imageId',
  requireAuth,
  async (req, res) => {
    const user = req.user.id;
    let reviewImage = await ReviewImage.findByPk(req.params.imageId, {
      include: [
        {
          model: Review
        }
      ]
    })
    // console.log('reviewImage', reviewImage.Review.userId)
    if (!reviewImage) {
      res.status(404);
      return res.json({
        message: "Review Image couldn't be found"
      })
    }
    if (user !== reviewImage.Review.userId) {
      res.status(403);
      return res.json({
        message: "Forbidden"
      })
    }
    if (user === reviewImage.Review.userId) {
      await reviewImage.destroy()
    }
    res.json({
      message: "Successfully deleted"
    })
  }
)

module.exports = router;
