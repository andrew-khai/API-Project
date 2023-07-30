export const GET_SPOTS = "GET/api/spots";
export const GET_SINGLE_SPOT = "GET/api/spots/:spotId";

//ACTION CREATORS
//Get all spots
const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    payload: spots
  }
}

//Get single spots
const getSingleSpot = (spot) => {
  return {
    type: GET_SINGLE_SPOT,
    payload: spot
  }
}


//REDUCER
const initialState = {allSpots: {}, singleSpot: {}}

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = Object.assign({}, state);
    default:
      return state;
  }
}
