import { csrfFetch } from "./csrf";
import { singleSpotThunk } from "./spots";

export const GET_REVIEWS_FOR_SPOT = "GET_REVIEWS_FOR_SPOT";
export const POST_REVIEW = "POST_REVIEW";
export const DELETE_REVIEW = "DELETE_REVIEW";

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

// Delete a Review
const deleteReview = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId
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
      console.log('in this res ok create review')
      const newReview = await res.json();
      dispatch(getAllReviewsThunk(review.spotId))
      dispatch(postReview(newReview));
      dispatch(singleSpotThunk(review.spotId));
      return newReview;
    }
  }
  catch (error) {
    console.log('in this create review error block')
    const errors = await error.json()
    return errors;
  }
}

// DELETE A REVIEW
export const deleteReviewThunk = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${review.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
  if (res.ok) {
    dispatch(deleteReview(review.id))
    dispatch(singleSpotThunk(review.spotId))
  }
  else {
    const errors = await res.json();
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
    case DELETE_REVIEW:
      newState = structuredClone(state);
      delete newState.Reviews[action.reviewId]
      return newState;
    default:
      return state;
  }
}

export default reviewsReducer;
