import { csrfFetch } from "./csrf";

export const GET_REVIEWS_FOR_SPOT = "GET_REVIEWS_FOR_SPOT";

//Action Creators

//GET ALL REVIEWS
const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS_FOR_SPOT,
    reviews
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


// REDUCER
const initialState = { Reviews : {} };

const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_REVIEWS_FOR_SPOT:
      newState = {...state, Reviews: {} };
      action.reviews.Reviews.forEach(review => {
        newState.Reviews[review.id] = review;
      });
      return newState;
    default:
      return state;
  }
}

export default reviewsReducer;
