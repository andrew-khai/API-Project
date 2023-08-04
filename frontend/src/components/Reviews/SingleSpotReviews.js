import './SingleSpotReviews.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const SingleSpotReview = ({ review }) => {
  const { spotId } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const spot = useSelector(state => state.spots.singleSpot)
  // console.log('sessionId', sessionUser.id)
  // console.log('owner', spot[spotId].ownerId)
  // console.log('review', review.User.firstName)
  // console.log(hasReviewed)

  useEffect(() => {
    if (sessionUser) {
      setIsLoggedIn(true);
    }
    if (sessionUser) {
      if (sessionUser.id === spot[spotId].ownerId) setIsOwner(true)
      if (sessionUser.id === review.User.id) setHasReviewed(true);
    }
  }, [spotId, sessionUser, isLoggedIn])

  // console.log(isOwner)
  // console.log(hasReviewed)
  // console.log('logged in', isLoggedIn)

  return (
    <>
      <div className='reviews-container'>
        <h3>{review.User.firstName}</h3>
        <p>{review.createdAt.slice(0, 10)}</p>
        <p>{review.review}</p>
        {sessionUser.id === review.User.id &&
          <button>Delete</button>
        }
      </div>
    </>
  )

}

export default SingleSpotReview;
