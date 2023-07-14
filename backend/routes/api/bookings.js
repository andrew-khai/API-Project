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
      // console.log(booking.Spot.SpotImages)
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
    // console.log('booking', userBooking.startDate)
    if (!userBooking) {
      res.status(404)
      return res.json({
        message: "Booking couldn't be found"
      })
    }
    if (userId !== userBooking.userId) {
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    }
    const { startDate, endDate } = req.body;
    // console.log('start', startDate)
    // console.log('end', endDate)
    const startDateString = new Date(startDate).toDateString()
    // console.log('start', startDateString)
    const startDateObj = new Date(startDateString).getTime()
    // console.log('start', startDateObj)
    const endDateString = new Date(endDate).toDateString()
    // console.log('end', endDateString)
    const endDateObj = new Date(endDateString).getTime()
    // console.log('end', endDateObj)
    if (startDateObj >= endDateObj) {
      res.status(400);
      return res.json({
        message: "endDate cannot be on or before startdate"
      })
    }
    if (startDateObj < new Date().getTime() || endDateObj < new Date().getTime()) {
      res.status(403);
      return res.json({
        message: "Past bookings can't be modified"
      })
    }
    if (startDateObj >= userBooking.startDate.getTime() && startDateObj <= userBooking.endDate.getTime()) {
      res.status(403);
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking"
        }
      })
    }
    if (endDateObj >= userBooking.startDate.getTime() && endDateObj <= userBooking.endDate.getTime()) {
      res.status(403);
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          endDate: "End date conflicts with an existing booking"
        }
      })
    }
    if (userId === userBooking.userId) {
      if (startDate) userBooking.startDate = startDate;
      if (endDate) userBooking.endDate = endDate;
    }
    await userBooking.save()

    res.json(userBooking)

  }
)

//Delete a Booking
router.delete(
  '/:bookingId',
  requireAuth,
  async (req, res) => {
    const user = req.user.id;
    let booking = await Booking.findByPk(req.params.bookingId);
    // console.log(booking.startDate.getTime())
    if (!booking) {
      res.status(404)
      return res.json({
        message: "Booking couldn't be found"
      })
    }
    if (user !== booking.userId) {
      res.status(403);
      return res.json({
        message: "Forbidden"
      })
    }
    if (booking.startDate.getTime() <= new Date().getTime() && booking.endDate.getTime() >= new Date().getTime()) {
      res.status(403);
      return res.json({
        message: "Bookings that have been started can't be deleted"
      })
    }
    if (user === booking.userId) {
      await booking.destroy()
    }
    res.json({
      message: "Successfully deleted"
    })
  }
)

module.exports = router;
