import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { singleSpotThunk } from "../../store/spots";
import './SingleSpotShow.css'
import noImage from '../../images/no-picture-available.png'
import { getAllReviewsThunk } from "../../store/reviews";
import SingleSpotReview from "../Reviews/SingleSpotReviews";

const SingleSpotShow = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(singleSpotThunk(spotId));
    dispatch(getAllReviewsThunk(spotId))
  }, [dispatch, spotId])

  const spot = useSelector(state => state.spots.singleSpot[spotId]);
  const spotReviews = useSelector(state => state.reviews.Reviews);
  const reviews = Object.values(spotReviews);

  if (!spot) return null;
  const spotImages = spot.SpotImages;
  // console.log(spotImages)
  const owner = spot.Owner;

  const onClick = (e) => {
    e.preventDefault();
    alert('Feature Coming Soon...')
  }

  // console.log('spot', spot)
  return (
    <div id="single-spot-container">
      <div id="spot-details-container">
        <h2>{spot.name}</h2>
        <p>{spot.city}, {spot.state}, {spot.country}</p>
      </div>
      <div id="single-spot-images-container">
        <img id="preview-image" src={spotImages[0]?.url || noImage}></img>
        <div id="other-images-container">
          <img className="other-images" src={spotImages[1]?.url || noImage}></img>
          <img className="other-images" src={spotImages[2]?.url || noImage}></img>
          <img className="other-images" src={spotImages[3]?.url || noImage}></img>
          <img className="other-images" src={spotImages[4]?.url || noImage}></img>
        </div>
      </div>
      <div id="single-spot-details-container">
        <div id="single-spot-description">
          <h2>Hosted by {owner.firstName} {owner.lastName}</h2>
          <p>{spot.description}</p>
        </div>
        <div id="single-spot-price-container">
          <div id="single-spot-price-ratings">
            <h2>${spot.price}<span style={{ fontSize: '16px', fontWeight: 'normal' }}> day</span></h2>
            <div>
              <i className="fa-solid fa-star fa-xs"></i>
              {spot.avgStarRating}
              {reviews.length ?
                <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '10px' }}>•</span> :
                " "
              }
              {spot.numReviews ?
                <span>{spot.numReviews} reviews</span> :
                "New"
              }
            </div>
          </div>
          <button id="reserve-button" onClick={onClick}>
            Reserve
          </button>
        </div>
      </div>
      <div id="reviews-container">
        <div id="review-star-num-container">
          <h2>
            <i className="fa-solid fa-star fa-xs"></i>
          </h2>
          <h2 style={{ marginRight: '10px' }}>
            {spot.avgStarRating}
          </h2>
          {reviews.length ?
            <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '10px' }}>•</span> :
            " "
          }
          <h2>
            {spot.numReviews ?
              <span>{spot.numReviews} reviews</span> :
              "New"
            }
          </h2>
        </div>
        {reviews.map(review => (
          <SingleSpotReview
            review={review}
            key={review.id}
          />
        ))
        }
      </div>
    </div>
  )
}


export default SingleSpotShow;
