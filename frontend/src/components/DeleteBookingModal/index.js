import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import './DeleteBookingModal.css'
// import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { deleteBookingThunk } from "../../store/bookings";


function DeleteBookingModal({ booking }) {
  // const history = useHistory();
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteBookingThunk(booking.id))
    closeModal();

    // history.push(`/spots/${Booking.spotId}`)
  }

  return (
    <div id="confirm-delete-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this Booking?</p>
      <div id="confirm-delete-buttons-container">
        <button
        id="yes-button"
        onClick={handleDelete}
        >Yes (Delete Booking)</button>
        <button
        id="no-button"
        onClick={closeModal}
        >No (Keep Booking)</button>
      </div>
    </div>
  )
}

export default DeleteBookingModal;
