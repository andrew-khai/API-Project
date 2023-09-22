const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile } = require("../../awsS3");

const router = express.Router();

// GET IMAGES

//Delete Spot Image by ID
router.delete(
  '/:imageId',
  requireAuth,
  async (req, res) => {
    const user = req.user.id;
    let spotImage = await SpotImage.findByPk(req.params.imageId, {
      include: [
        {
          model: Spot
        }
      ]
    });
    // console.log('spotImage', user, spotImage.Spot.ownerId)
    if (!spotImage) {
      res.status(404);
      return res.json({
        message: "Spot Image couldn't be found"
      })
    }
    if (user !== spotImage.Spot.ownerId) {
      res.status(403);
      return res.json({
        message: "Forbidden"
      })
    }
    if (user === spotImage.Spot.ownerId) {
      await spotImage.destroy()
    }
    res.json({
      message: "Successfully deleted"
    })
  }
)

module.exports = router;
