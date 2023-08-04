import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import './DeleteReviewModal.css'
// import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { deleteReviewThunk } from "../../store/reviews";

function DeleteReviewModal({ review }) {
  // const history = useHistory();
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteReviewThunk(review));
    closeModal();

    // history.push(`/spots/${review.spotId}`)
  }

  return (
    <div id="confirm-delete-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this review?</p>
      <div id="confirm-delete-buttons-container">
        <button
        id="yes-button"
        onClick={handleDelete}
        >Yes (Delete Review)</button>
        <button
        id="no-button"
        onClick={closeModal}
        >No (Keep Review)</button>
      </div>
    </div>
  )
}

export default DeleteReviewModal;
