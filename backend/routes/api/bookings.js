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
        } else {
          booking.Spot.previewImage = "no preview"
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
    const userBooking = await Booking.findByPk(req.params.bookingId, {
      include: [
        {
          model: Spot,
          include: [
            {
              model: Booking
            }
          ]
        }
      ]
    });
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
    // console.log('start edit', startDate)
    // console.log('end edit', endDate)
    const startDateString = new Date(startDate).toDateString()
    // console.log('start', startDateString)
    const startDateStringCopy = new Date(startDate)
    // console.log('start copy', startDateStringCopy)
    // console.log('start copy', startDateStringCopy.getTime())
    const startDateObj = new Date(startDateString).getTime()
    // console.log('start obj', startDateObj)
    const endDateString = new Date(endDate).toDateString()
    // console.log('end', endDateString)
    const endDateObj = new Date(endDateString).getTime()
    // console.log('end obj', endDateObj)

    if (startDateObj >= endDateObj) {
      res.status(400);
      return res.json({
        message: "Checkout cannot come before Check-In"
      })
    }
    if (userBooking.startDate.getTime() < new Date().getTime()) {
      res.status(403);
      return res.json({
        message: "Past bookings can't be modified"
      })
    }
    let allBookingId = [parseInt(req.params.bookingId)];
    // console.log('first', allBookingId)

    // console.log(userBooking.Spot.Bookings.length)
    for (let i = 0; i < userBooking.Spot.Bookings.length; i++) {
      let booking = userBooking.Spot.Bookings[i];
      // console.log('booking', booking)
      // console.log(booking.id)

      if (!allBookingId.includes(booking.id)) {
        allBookingId.push(booking.id)
        let startDate = booking.startDate.getTime();
        // console.log('start obj', new Date(startDateObj))
        // console.log('start date', new Date (startDate))
        let endDate = booking.endDate.getTime();
        // console.log('end obj', new Date(endDateObj))
        // console.log('end date', new Date(endDate))
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
      // console.log('second', allBookingId)
    }

    if (userId === userBooking.userId) {
      if (startDate) userBooking.startDate = startDate;
      if (endDate) userBooking.endDate = endDate;
    }
    await userBooking.save()

    let currentBooking = userBooking.toJSON()
    // console.log('current', currentBooking)
    delete currentBooking.Spot;

    res.json(currentBooking)

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
