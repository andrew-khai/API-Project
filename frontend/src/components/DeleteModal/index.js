import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import './DeleteModal.css'
import { useHistory } from "react-router-dom";

function DeleteModal({ spot }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteSpotThunk(spot.id));
    // history.push(`/spots/current`);
    closeModal();
  }

  return (
    <div id="confirm-delete-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <div id="confirm-delete-buttons-container">
        <button
        id="yes-button"
        onClick={handleDelete}
        >Yes (Delete Spot)</button>
        <button
        id="no-button"
        onClick={closeModal}
        >No (Keep Spot)</button>
      </div>
    </div>
  )
}

export default DeleteModal;
