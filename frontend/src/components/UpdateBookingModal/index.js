import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import "./UpdateBookingModal.css"
import { updateBookingThunk } from "../../store/bookings";

function UpdateBookingModal({ booking, onUpdate }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(booking?.startDate);
  const [endDate, setEndDate] = useState(booking?.endDate);
  const today = new Date()

  const getDateTime = (date) => {
    const dateString = new Date(date).toDateString()
    const dateObj = new Date(dateString).getTime()

    return dateObj;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let updatedBooking = {
      id: booking.id,
      startDate,
      endDate
    }

    const newBooking = await dispatch(updateBookingThunk(updatedBooking))

    if (newBooking.message) {
      setErrors(newBooking);
      return;
    }

    closeModal()
  }

  return (
    <div id="confirm-booking-container">
      <h2 style={{ textAlign: "center" }}>Update Your Booking</h2>
      <form id="update-booking-form" onSubmit={handleSubmit}>
        <div style={{ display: "flex", columnGap: "10px" }}>
          <label className="reserve-form-labels">
            Check-In
            <input
              className="reserve-form-dates"
              type="date"
              value={startDate.slice(0, 10)}
              onChange={(e) => setStartDate(e.target.value)}
              required
            >
            </input>
          </label>
          <label className="reserve-form-labels">
            Checkout
            <input
              className="reserve-form-dates"
              type="date"
              value={endDate.slice(0, 10)}
              onChange={(e) => setEndDate(e.target.value)}
              required
            >
            </input>
          </label>
        </div>
        {errors.message &&
          <p style={{ textAlign: "center", marginBottom: "10px" }} className="errors">{errors.message}</p>
        }
        <button className="submit-update-button" type="submit"
          // disabled={!startDate ||
          //   !endDate ||
          //   getDateTime(startDate) > getDateTime(endDate) ||
          //   getDateTime(endDate) - getDateTime(startDate) < 7 * 24 * 60 * 60 * 1000 ||
          //   getDateTime(startDate) < getDateTime(today) ||
          //   getDateTime(endDate) < getDateTime(today)
          // }
        >Update</button>
      </form>
    </div>
  )

}

export default UpdateBookingModal;
