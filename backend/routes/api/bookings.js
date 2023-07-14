const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get(
  '/current',
  requireAuth,
  async (req, res) => {
    const user = req.user.id;
    const userBookings = await Booking.findAll({
      attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
      include: {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: [
          {
            model: SpotImage
          }
        ]
      },
      where: {
        userId: user
      }
    });

    let allBookings = [];
    userBookings.forEach(booking => {
      allBookings.push(booking.toJSON())
    })
    allBookings.forEach(booking => {
      console.log(booking.Spot.SpotImages)
      booking.Spot.SpotImages.forEach(spotImage => {
        if (spotImage.preview) {
          booking.Spot.previewImage = spotImage.url
        }
      })
      delete booking.Spot.SpotImages
    })
    res.json({
      Bookings: allBookings
    })
  }
)

//Edit a Booking
router.put(
  '/:bookingId',
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;
    const userBooking = await Booking.findByPk(req.params.bookingId);
    if (!userBooking) {
      res.status(404)
      return res.json({
        message: "Booking couldn't be found"
      })
    }

  }
)

//Delete a Booking
router.delete(
  '/:bookingId',
  requireAuth,
  async (req, res) => {
    const user = req.user.id;
    let booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
      res.status(404)
      return res.json({
        message: "Booking couldn't be found"
      })
    }
  }
)

module.exports = router;
