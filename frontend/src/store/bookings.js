import { csrfFetch } from "./csrf";

export const CURRENT_BOOKINGS = "CURRENT_BOOKINGS";
export const CREATE_BOOKING = "CREATE_BOOKING";

const getCurrentBookings = (bookings) => {
  return {
    type: CURRENT_BOOKINGS,
    bookings
  }
}

const createBooking = (booking) => {
  return {
    type: CREATE_BOOKING,
    booking
  }
}

// THUNKS
export const getCurrentBookingsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/bookings/current`);
  if (res.ok) {
    const bookings = await res.json();
    dispatch(getCurrentBookings(bookings));
    return bookings
  }
}

export const createBookingThunk = (booking) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${booking.spotId}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(booking)
  })

  if (res.ok) {
    const newBooking = await res.json();
    dispatch(createBooking(newBooking));
    return newBooking;
  }
  else {
    const errors = await res.json();
    return errors
  }
}

const initialState = { Bookings: {}, currentBookings: {} }

const bookingsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case CURRENT_BOOKINGS:
      newState = {...state};
      action.bookings.Bookings.forEach(booking => {
        newState.currentBookings[booking.id] = booking;
      })
      return newState;
    case CREATE_BOOKING:
      newState = {...state};
      newState.Bookings[action.booking.id] = action.booking;
      return newState;
      default:
        return state;
  }
}

export default bookingsReducer;
