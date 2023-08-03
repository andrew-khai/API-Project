import { csrfFetch } from "./csrf";

export const GET_SPOTS = "GET/api/spots";
export const GET_SINGLE_SPOT = "GET/api/spots/:spotId";
export const CREATE_SPOT = "POST/api/spots";
export const EDIT_SPOT = "PUT/api/:spotId";
export const GET_USER_SPOTS = "GET/api/current";
export const DELETE_SPOT = "DELETE/api/:spotId";

//ACTION CREATORS

//Get all spots
const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots
  }
}

const userSpots = (spots) => {
  return {
    type: GET_USER_SPOTS,
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

// Create Spot
const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot
  }
}

// Edit a spot
const editSpot = (spot) => {
  return {
    type: EDIT_SPOT,
    spot
  }
}

// Delete a Spot
const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId
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

//GET CURRENT USER SPOTS
export const getUserSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current');
  if (res.ok) {
    const spots = await res.json();
    dispatch(userSpots(spots));
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
  try {
    const res = await csrfFetch(`/api/spots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(spot)
    })

    if (res.ok) {
      const newSpot = await res.json();
      // console.log('new', newSpot)
      dispatch(createSpot(newSpot));
      return newSpot;
    }
  }
  catch (error) {
    const errors = await error.json()
    // console.log('errors', errors)
    return errors

  }
}

// EDIT SPOT THUNK
export const editSpotThunk = (spot) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(spot)
    })

    if (res.ok) {
      const updatedSpot = await res.json();
      dispatch(editSpot(updatedSpot));
      return updatedSpot
    }
  }
  catch (error) {
    const errors = await error.json();
    return errors;
  }
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (res.ok) {
    dispatch(deleteSpot(spotId))
  }
  else {
    const errors = await res.json();
    return errors;
  }
}

//REDUCER
const initialState = { allSpots: {}, singleSpot: {} }

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = { ...state, allSpots: {} }
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot;
      })
      return newState;
    case GET_USER_SPOTS:
      newState = { ...state, allSpots: {} }
      // console.log('action spots', action.spots)
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot;
      })
      return newState;
    case GET_SINGLE_SPOT:
      newState = { ...state, singleSpot: {} };
      newState.singleSpot[action.spot.id] = action.spot
      return newState;
    case CREATE_SPOT:
      newState = structuredClone(state);
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    case EDIT_SPOT:
      newState = structuredClone(state);
      newState.singleSpot = action.spot;
      return newState
    case DELETE_SPOT:
      newState = { ...state };
      delete newState[action.spotId];
      return newState;
    default:
      return state;
  }
}

export default spotsReducer;
