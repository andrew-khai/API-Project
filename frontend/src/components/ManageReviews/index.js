import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getCurrentReviewsThunk } from "../../store/reviews";
import "./ManageReviews.css"
import UserReviews from "./UserReviews";

const ManageReviews = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  useEffect(() => {
    if (sessionUser) {
      dispatch(getCurrentReviewsThunk());
    }
  }, [dispatch])

  const reviews = useSelector(state => Object.values(state.reviews.currentReviews))

  // console.log(reviews)
  reviews.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return dateB - dateA;
  })

  return (
    <>
      <div id="manage-reviews-container">
        <h2 style={{ textAlign: "center" }}>Manage Your Reviews</h2>
      </div>
      {reviews && reviews.length > 0 ?
      <div id="users-reviews-container">
        {reviews.map(review => (
          <UserReviews
          review={review}
          key={review.id}
          />
        ))}
      </div>
      :
      <div id="no-reviews-container">
        <div style={{textAlign: "center"}}><i class="fa-solid fa-spinner fa-lg"></i></div>
        <div style={{textAlign: "center", fontSize: "1.2rem"}}>You have no reviews yet!</div>
      </div>
    }
    </>
  )
}

export default ManageReviews;
