import { csrfFetch } from "./csrf";

export const GET_REVIEWS_FOR_SPOT = "GET_REVIEWS_FOR_SPOT";
export const POST_REVIEW = "POST_REVIEW";

//Action Creators

//GET ALL REVIEWS
const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS_FOR_SPOT,
    reviews
  }
}

// Post a Review
const postReview = (review) => {
  return {
    type: POST_REVIEW,
    review
  }
}


//THUNK ACTION CREATORS

//GET ALL REVIEWS
export const getAllReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const reviews = await res.json();
    dispatch(getReviews(reviews));
    return reviews
  }
}

//CREATE A REVIEW
export const createReviewThunk = (review) => async (dispatch) => {
  try {
    console.log('createReview thunk review', review)
    const res = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(review)
    })

    if (res.ok) {
      const newReview = await res.json();
      dispatch(postReview(newReview));
      return newReview;
    }
  }
  catch (error) {
    const errors = await error.json()
    return errors;
  }
}


// REDUCER
const initialState = { Reviews: {} };

const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_REVIEWS_FOR_SPOT:
      newState = { ...state, Reviews: {} };
      action.reviews.Reviews.forEach(review => {
        newState.Reviews[review.id] = review;
      });
      return newState;
    case POST_REVIEW:
      newState = structuredClone(state);
      newState.Reviews[action.review.id] = action.review;
      return newState;
    default:
      return state;
  }
}

export default reviewsReducer;
