import { useState } from "react";
import './ReviewModal.css';

function ReviewModal() {
  const [review, setReview] = useState();
  const [starRating, setStarRating] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

  }

  return (
    <div id="review-modal-container">
      <h2>How was your stay?</h2>
      <label>
        <textarea
          type="textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Just a quick review"
          style={{ width: '300px', height: '100px' }}
        >
        </textarea>
      </label>
      <div id="review-stars-container">
        <div>
          <i class="fa-regular fa-star" style={{ color: "#000000" }}></i>
        </div>
        <div>
          <i class="fa-regular fa-star" style={{ color: "#000000" }}></i>
        </div>
        <div>
          <i class="fa-regular fa-star" style={{ color: "#000000" }}></i>
        </div>
        <div>
          <i class="fa-regular fa-star" style={{ color: "#000000" }}></i>
        </div>
        <div>
          <i class="fa-regular fa-star" style={{ color: "#000000" }}></i>
        </div>

        <span>Stars</span>
      </div>
      <button
        id="submit-review-button"
      >Submit Your Review</button>
    </div>
  )
}

export default ReviewModal;
