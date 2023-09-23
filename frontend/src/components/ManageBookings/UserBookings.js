import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
// import { deleteBookingThunk } from "../../store/bookings";
import OpenModalButton from "../OpenModalButton";
import DeleteBookingModal from "../DeleteBookingModal";
import UpdateBookingModal from "../UpdateBookingModal";
// import { updateBookingThunk } from "../../store/bookings";
import { useState } from "react";

const UserBookings = ({ booking }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  // const handleDelete = async (e) => {
  //   e.preventDefault();
  //   await dispatch(deleteBookingThunk(booking.id))
  // }
  // const handleUpdate = async (updatedBookingData) => {
  //   setErrors({})
  //   // console.log('making it into this call', updatedBookingData)
  //   const updatedBooking = await dispatch(updateBookingThunk(updatedBookingData));
  //   if (updatedBooking.message) {
  //     setErrors(updatedBooking);
  //     return;
  //   }

  // }

  return (
    <>
      <div className="user-booking-container">
        <div>
          <NavLink to={`/spots/${booking.spotId}`}>
            <img style={{ width: "300px", height: "200px", borderRadius: "10px" }} src={booking.Spot?.previewImage} />
          </NavLink>
        </div>
        <div className="booking-information">
          <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{booking.Spot.name}</div>
          <div>{booking.Spot.city}, {booking.Spot.state}, {booking.Spot.country}</div>
          <div className="booking-info-times">
            <div>
              <div style={{fontWeight: "bold"}}>Check-in Date:</div>
              <div>{booking.startDate.slice(0, 10)}</div>
            </div>
            <div>
              <div style={{fontWeight: "bold"}}>Checkout Date:</div>
              <div>{booking.endDate.slice(0, 10)}</div>
            </div>
          </div>
          <div className="booking-button-container">
            <OpenModalButton
            buttonText="Update"
            modalComponent={<UpdateBookingModal booking={booking}/>}
            />
            <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteBookingModal booking={booking} />}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserBookings;
