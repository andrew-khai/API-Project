import { useState } from "react";
import './ReviewModal.css';
import StarRatingInput from "./StarRatingInput";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory, useParams } from "react-router-dom";
import { createReviewThunk, getAllReviewsThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";

function ReviewModal({ singleSpotId }) {

  const { closeModal } = useModal();
  const { spotId } = useParams()

  // console.log('another spotID here at modal', singleSpotId)
  const spot = useSelector(state => state.spots.singleSpot);
  // const spotId = Object.values(spot)[0].id;
  const sessionUser = useSelector(state => state.session.user);
  const firstName = sessionUser.firstName;
  console.log('use selector spot here', spot.id)

  const dispatch = useDispatch();
  // const history = useHistory();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0.0);
  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})
    const reviewItem = {
      firstName: firstName,
      spotId: spot.id,
      review: review,
      stars: stars
    }
    // const reviews = await dispatch(getAllReviewsThunk(spotId));
    // console.log('reviews here look', reviews)
    const newReview = await dispatch(createReviewThunk(reviewItem));
    if (newReview.errors) {
      setErrors(newReview.errors);
      return;
    }
    console.log('nre review here look', newReview)
    // if (reviews) {
    //   let errorObj = {}
    //   Object.values(reviews).forEach(review => {
    //     if (review.userId === newReview.userId) {
    //       errorObj.serverError = "User already submitted a review"
    //     }
    //   })
    //   setErrors(errorObj);
    // }
    // history.push(`/spots/${spotId}`)
    closeModal();

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
      {errors.serverError &&
        <p className="errors">{errors.serverError}</p>}
      <label>
        <textarea
          type="textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave your review here (min 10 characters)..."
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
        disabled={review.length < 10 || stars < 1}
      >Submit Your Review</button>
    </div>
  )
}

export default ReviewModal;
