import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteModal from "../DeleteModal";
import DeleteReviewModal from "../DeleteReviewModal";

const UserReviews = ({ review }) => {
  // console.log(review)
  return (
    <>
      <div className="user-review-container">
        <div>
          <NavLink to={`/spots/${review.spotId}`}>
            <img style={{ width: "300px", height: "200px", borderRadius: "10px" }} src={review.Spot.previewImage} />
          </NavLink>
        </div>
        <div className="review-spot-information">
          <div style={{fontSize: "1.2rem", fontWeight: "bold"}}>{review.Spot.name}</div>
          <div>{review.Spot.city}, {review.Spot.state}, {review.Spot.country}</div>
          <div className="review-review-container">
            <div className="review-review-info">
              <div style={{fontSize: "1.1rem"}}>Review: {review.review}</div>
              <div style={{fontSize: "1.1rem"}}>{review.createdAt.slice(0, 10)}</div>
            </div>
            <div style={{fontSize: "1.1rem"}}>Rating: {review.stars} <i style={{color: "red"}} class="fa-solid fa-star"></i> </div>
            <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteReviewModal review={review} />}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserReviews;
