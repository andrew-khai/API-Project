import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBookingsThunk } from "../../store/bookings";
import UserBookings from "./UserBookings";
import { NavLink } from "react-router-dom";
import "./ManageBookings.css"
import PastBookings from "./PastBookings";

const ManageBookings = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(getCurrentBookingsThunk())
  }, [dispatch])

  const bookings = useSelector(state => Object.values(state.bookings.currentBookings))
  bookings.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    return dateA - dateB;
  })

  const currentDate = new Date();

  const upcoming = bookings.filter(booking => {
    const startDate = new Date(booking.startDate);

    return startDate > currentDate;
  })
  const past = bookings.filter(booking => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    return startDate || endDate < currentDate;
  })
  // console.log(bookings)
  // console.log(past)
  return (
    <>
      <div id="manage-reviews-container">
        <h2 style={{ textAlign: "center" }}>Manage Your Bookings</h2>
      </div>
      {upcoming && upcoming.length > 0 ?
        <div id="users-bookings-container">
          {upcoming.map(booking => (
            <UserBookings
              booking={booking}
              key={booking.id}
            />
          ))}
        </div>
        :
        <div id="no-reviews-container">
          <div style={{ textAlign: "center", marginBottom: "10px" }}><i class="fa-solid fa-spinner fa-lg"></i></div>
          <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>No spots booked...yet!</div>
          <div style={{ textAlign: "center", fontSize: "1rem" }}>Time to dust of your shoes and start planning your next game</div>
          <NavLink to="/">Start searching</NavLink>
        </div>
      }
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Past Bookings</h2>
      {past && past.length > 0 ?
        <div id="users-bookings-container">
          {past.map(booking => (
            <PastBookings
              booking={booking}
              key={booking.id}
            />
          ))}
        </div>
        :
        <div style={{marginTop: "20px"}} id="no-reviews-container">
        <div style={{ textAlign: "center", marginBottom: "10px" }}><i class="fa-solid fa-spinner fa-lg"></i></div>
        <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>No past bookings</div>
        <NavLink to="/">Start searching</NavLink>
      </div>
      }

    </>
  )
}

export default ManageBookings;
