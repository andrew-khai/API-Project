import './SingleSpotReviews.css'

const SingleSpotReview = ({review}) => {

  return (
    <>
      <h3>{review.User.firstName}</h3>
      <p>{review.createdAt.slice(0, 10)}</p>
      <p>{review.review}</p>
    </>
  )

}

export default SingleSpotReview;
