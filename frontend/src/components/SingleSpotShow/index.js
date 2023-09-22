import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { singleSpotThunk } from "../../store/spots";
import './SingleSpotShow.css'
import noImage from '../../images/no-picture-available.png'
import { getAllReviewsThunk } from "../../store/reviews";
import SingleSpotReview from "../Reviews/SingleSpotReviews";
import OpenModalButton from "../OpenModalButton";
import ReviewModal from "../ReviewModal";
import { createBookingThunk } from "../../store/bookings";
import MapContainer from "../Maps";

const SingleSpotShow = () => {
  const { spotId } = useParams();

  const today = new Date();

  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);

  const initialStartDate = today.toISOString().split('T')[0];
  const initialEndDate = fiveDaysLater.toISOString().split('T')[0];

  const [singleSpotId, setSingleSpotId] = useState(spotId);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [bookingMessage, setBookingMessage] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(singleSpotThunk(spotId));
    dispatch(getAllReviewsThunk(spotId))
  }, [dispatch, spotId])

  const sessionUser = useSelector(state => state.session.user)
  // console.log(sessionUser.id)
  const spot = useSelector(state => state.spots.singleSpot);
  // console.log('spot', spot)
  const spotReviews = useSelector(state => state.reviews.Reviews);
  const reviews = Object.values(spotReviews);
  const descOrderReviews = reviews.reverse();
  // console.log('reviews over here wooooo', reviews)
  // console.log('reviews has userId', reviews.find(review => review.userId === sessionUser.id))

  if (!spot || !spot.id) return null;
  const spotImages = spot.SpotImages;
  // console.log(spotImages)
  const owner = spot.Owner;
  // console.log('owner', owner.id)

  const onClick = (e) => {
    e.preventDefault();
    alert('Feature Coming Soon...')
  }

  // console.log('session user SingleSPotSHow', sessionUser);
  // console.log('owner SingleSpotShow', owner);
  // console.log('reviews -------', reviews)

  // console.log('spot', spot)
  const ownerCheck = () => {
    // console.log('in owner check')
    if (sessionUser) {
      if (sessionUser?.id === owner?.id) {
        return true
      }
      else return false;
    }
    return;
    // else setIsOwner(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const booking = {
      spotId: spot.id,
      userId: sessionUser.id,
      startDate,
      endDate
    }

    const newBooking = await dispatch(createBookingThunk(booking))
    if (newBooking.errors) {
      setErrors(newBooking.errors)
    }

    setBookingMessage('Spot has been booked! We look forward to hosting you, manage your booking in your "Manage Bookings" tab');

    // Clear the message after 5 seconds
    setTimeout(() => {
      setBookingMessage('');
    }, 3000);
  }

  // console.log(isOwner)

  return (
    <>
      {!sessionUser ?
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
              <h2>Hosted by {owner?.firstName} {owner?.lastName}</h2>
              <p style={{ wordBreak: "break-word" }}>{spot.description}</p>
            </div>
            <div id="single-spot-price-container">
              <div id="single-spot-price-ratings">
                <h2>${spot.price}<span style={{ fontSize: '16px', fontWeight: 'normal' }}> day</span></h2>
                <div>
                  <i className="fa-solid fa-star fa-xs"></i>
                  {spot.avgStarRating?.toFixed(1)}
                  {reviews.length ?
                    <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '10px' }}>•</span> :
                    " "
                  }
                  {spot.numReviews ?
                    <span>
                      {spot.numReviews === 1 ?
                        <span>{spot.numReviews} review</span> :
                        <span>{spot.numReviews} reviews</span>
                      }
                    </span> :
                    <span>
                      New
                    </span>
                  }
                </div>
              </div>
              <div>
                <form id="reserve-form" onSubmit={handleSubmit}>
                  <div style={{ display: "flex" }}>
                    <label className="reserve-form-labels">
                      Check-In
                      <input
                        className="reserve-form-dates"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      >
                      </input>
                    </label>
                    <label className="reserve-form-labels">
                      Checkout
                      <input
                        className="reserve-form-dates"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      >
                      </input>
                    </label>
                  </div>
                  {bookingMessage && (
                    <div className="booking-success-message">
                      {bookingMessage}
                    </div>
                  )}
                  <button type="submit" id="reserve-button" disabled={ownerCheck() || !sessionUser}>
                    Reserve
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div style={{margin: "10px 0px", fontSize: "1.5rem"}}>Where you'll be.</div>
            <MapContainer spot={spot}/>
          </div>
          <div id="reviews-section-container">
            <div id="review-star-num-container">
              <h2>
                <i className="fa-solid fa-star fa-xs"></i>
              </h2>
              <h2 style={{ marginRight: '10px' }}>
                {spot.avgStarRating?.toFixed(1)}
              </h2>
              {reviews.length ?
                <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '10px' }}>•</span> :
                " "
              }
              {spot.numReviews ?
                <h2>
                  {spot.numReviews === 1 ?
                    <span>{spot.numReviews} review</span> :
                    <span>{spot.numReviews} reviews</span>
                  }
                </h2> :
                <h2>
                  New
                </h2>
              }
            </div>
            {descOrderReviews.map(review => (
              <SingleSpotReview
                review={review}
                key={review.id}
              />
            ))
            }
          </div>
        </div> :
        <div id="single-spot-container">
          <div id="spot-details-container">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
          </div>
          <div id="single-spot-images-container">
            <img id="preview-image" src={spotImages ? spotImages[0] ? spotImages[0].url : noImage : noImage}></img>
            <div id="other-images-container">
              <img className="other-images" src={spotImages ? spotImages[1] ? spotImages[1].url : noImage : noImage}></img>
              <img className="other-images" src={spotImages ? spotImages[2] ? spotImages[2].url : noImage : noImage}></img>
              <img className="other-images" src={spotImages ? spotImages[3] ? spotImages[3].url : noImage : noImage}></img>
              <img className="other-images" src={spotImages ? spotImages[4] ? spotImages[4].url : noImage : noImage}></img>
            </div>
          </div>
          <div id="single-spot-details-container">
            <div id="single-spot-description">
              <h2>Hosted by {owner?.firstName} {owner?.lastName}</h2>
              <p style={{ wordBreak: "break-word" }}>{spot.description}</p>
            </div>
            <div id="single-spot-price-container">
              <div id="single-spot-price-ratings">
                <h2>${spot.price}<span style={{ fontSize: '16px', fontWeight: 'normal' }}> day</span></h2>
                <div>
                  <i className="fa-solid fa-star fa-xs"></i>
                  {spot.avgStarRating?.toFixed(1)}
                  {reviews.length ?
                    <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '10px' }}>•</span> :
                    " "
                  }
                  {spot.numReviews ?
                    <span>
                      {spot.numReviews === 1 ?
                        <span>{spot.numReviews} review</span> :
                        <span>{spot.numReviews} reviews</span>
                      }
                    </span> :
                    <span>
                      New
                    </span>
                  }
                </div>
              </div>
              <div>
                <form id="reserve-form" onSubmit={handleSubmit}>
                  <div style={{ display: "flex" }}>
                    <label className="reserve-form-labels">
                      Check-In
                      <input
                        className="reserve-form-dates"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      >
                      </input>
                    </label>
                    <label className="reserve-form-labels">
                      Checkout
                      <input
                        className="reserve-form-dates"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      >
                      </input>
                    </label>
                  </div>
                  {bookingMessage && (
                    <div className="booking-success-message">
                      {bookingMessage}
                    </div>
                  )}
                  <button type="submit" id="reserve-button" disabled={ownerCheck() || !sessionUser}>
                    Reserve
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div style={{margin: "10px 0px", fontSize: "1.5rem"}}>Where you'll be.</div>
            <MapContainer spot={spot} />
          </div>
          <div id="reviews-section-container">
            <div id="review-star-num-container">
              <h2>
                <i className="fa-solid fa-star fa-xs"></i>
              </h2>
              <h2 style={{ marginRight: '10px' }}>
                {spot.avgStarRating?.toFixed(1)}
              </h2>
              {reviews.length ?
                <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '10px' }}>•</span> :
                " "
              }
              {spot.numReviews ?
                <h2>
                  {spot.numReviews === 1 ?
                    <span>{spot.numReviews} review</span> :
                    <span>{spot.numReviews} reviews</span>
                  }
                </h2> :
                <h2>
                  New
                </h2>
              }
            </div>
            {!spot.numReviews && sessionUser && owner && (sessionUser?.id !== owner?.id) &&
              <div className="first-to-review-container">
                <OpenModalButton
                  buttonText="Post Your Review"
                  modalComponent={<ReviewModal />}
                  singleSpotId={singleSpotId}
                />
                <p>Be the first to post a review!</p>
              </div>
            }
            {(!(reviews.find(review => review.userId === sessionUser.id)) && spot.numReviews && (sessionUser.id !== owner.id)) ?
              <div className="post-your-review-container">
                <OpenModalButton
                  buttonText="Post Your Review"
                  modalComponent={<ReviewModal />}
                  singleSpotId={singleSpotId}
                />
              </div> :
              <></>

            }
            {descOrderReviews.map(review => (
              <SingleSpotReview
                review={review}
                key={review.id}
              />
            ))
            }
          </div>
        </div>
      }
    </>
  )
}


export default SingleSpotShow;
