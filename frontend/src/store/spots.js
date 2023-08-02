import { csrfFetch } from "./csrf";

export const GET_SPOTS = "GET/api/spots";
export const GET_SINGLE_SPOT = "GET/api/spots/:spotId";
export const CREATE_SPOT = "POST/api/spots";

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
    spot
  }
}

const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot
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
  else {
    const errors = await res.json();
    return errors;
  }
}

//GET SINGLE SPOT
export const singleSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`)
  if (res.ok) {
    const singleSpot = await res.json();
    dispatch(getSingleSpot(singleSpot));
    return singleSpot;
  }
  else {
    const errors = await res.json();
    return errors;
  }
}

// Create a Spot
export const createASpot = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(spot)
  })

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(createSpot(newSpot));
    return newSpot;
  }
  else {
    const errors = await res.json();
    console.log('errors', errors)
    return errors
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
    case GET_SINGLE_SPOT:
      newState = {...state, singleSpot: {}};
      newState.singleSpot[action.spot.id] = action.spot
      return newState;
    case CREATE_SPOT:
      newState = structuredClone(state);
      newState.allSpots[action.spot.id] = action.spot;
      // newState.singleSpot[action.spot.id] = action.spot;
      return newState;
    default:
      return state;
  }
}

export default spotsReducer;
