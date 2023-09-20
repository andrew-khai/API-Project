import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBookingsThunk } from "../../store/bookings";
import UserBookings from "./UserBookings";
import { NavLink } from "react-router-dom";
import "./ManageBookings.css"

const ManageBookings = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(getCurrentBookingsThunk())
  }, [dispatch])

  const bookings = useSelector(state => Object.values(state.bookings.currentBookings))
  // console.log(bookings)
  return (
    <>
      <div id="manage-reviews-container">
        <h2 style={{ textAlign: "center" }}>Manage Your Bookings</h2>
      </div>
      {bookings && bookings.length > 0 ?
      <div id="users-bookings-container">
        {bookings.map(booking => (
          <UserBookings
          booking={booking}
          key={booking.id}
          />
        ))}
      </div>
      :
      <div id="no-reviews-container">
        <div style={{textAlign: "center", marginBottom: "10px"}}><i class="fa-solid fa-spinner fa-lg"></i></div>
        <div style={{textAlign: "center", fontSize: "1.2rem", fontWeight: "bold"}}>No spots booked...yet!</div>
        <div style={{textAlign: "center", fontSize: "1rem"}}>Time to dust of your shoes and start planning your next game</div>
        <NavLink to="/">Start searching</NavLink>
      </div>
    }
    </>
  )
}

export default ManageBookings;
