import { NavLink } from "react-router-dom";

const UserBookings = ({ booking }) => {
  return (
    <>
      <div className="user-booking-container">
        <div>
          <NavLink to={`/projects/${booking.spotId}`}>
            <img style={{ width: "300px", height: "200px", borderRadius: "10px" }} src={booking.Spot.previewImage} />
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
            <button>Update</button>
            <button>Delete</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserBookings;
