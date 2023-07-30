import { csrfFetch } from "./csrf";

export const GET_SPOTS = "GET/api/spots";
export const GET_SINGLE_SPOT = "GET/api/spots/:spotId";

//ACTION CREATORS
//Get all spots
const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots
  }
}

//Get single spots
const getSingleSpot = (spot) => {
  return {
    type: GET_SINGLE_SPOT,
    payload: spot
  }
}

//THUNK ACTION CREATORS

//GET ALL SPOTS
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(getSpots(spots))
    return spots;
  }
}


//REDUCER
const initialState = {allSpots: {}, singleSpot: {}}

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = {...state, allSpots: {}}
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot;
      })
      return newState;
    default:
      return state;
  }
}

export default spotsReducer;
