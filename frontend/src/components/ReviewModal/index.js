import { useState } from "react";
import './ReviewModal.css';
import StarRatingInput from "./StarRatingInput";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createReviewThunk } from "../../store/reviews";

function ReviewModal({ singleSpotId }) {

  // console.log('another spotID here at modal', singleSpotId)
  const spot = useSelector(state => state.spots.singleSpot);
  const spotId = Object.values(spot)[0].id
  // console.log('use selector spot here', spotId)

  const dispatch = useDispatch();
  const history = useHistory();
  const [review, setReview] = useState();
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})
    const reviewItem = {
      spotId: spotId,
      review: review,
      stars: stars
    }

    const newReview = await dispatch(createReviewThunk(reviewItem));
    if (newReview.errors) {
      setErrors(newReview.errors);
      return;
    }

    history.push(`/spots/${spotId}`)

  }

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    <div id="review-modal-container">
      <h2>How was your stay?</h2>
      {errors.review &&
        <p className="errors">{errors.review}</p>}
      {errors.stars &&
        <p className="errors">{errors.stars}</p>}
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
        <StarRatingInput disabled={false} onChange={onChange} stars={stars} />
        <span>Stars</span>
      </div>
      <button
        id="submit-review-button"
        onClick={handleSubmit}
      >Submit Your Review</button>
    </div>
  )
}

export default ReviewModal;
