import { csrfFetch } from "./csrf";

export const GET_SPOTS = "GET/api/spots";
export const GET_SINGLE_SPOT = "GET/api/spots/:spotId";
export const CREATE_SPOT = "POST/api/spots";
export const EDIT_SPOT = "PUT/api/:spotId";
export const GET_USER_SPOTS = "GET/api/current";
export const DELETE_SPOT = "DELETE/api/:spotId";
export const ADD_IMAGE = "POST/addImages";
export const UNLOAD_SINGLESPOT = "UNLOAD_SINGLESPOT"

//ACTION CREATORS

//Get all spots
const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots
  }
}

// Get Current User Spots
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

const unloadSingleSpot = () => {
  return {
    type: UNLOAD_SINGLESPOT
  }
}

// Create Spot
const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot
  }
}

// Add Images
const addImage = (image, spotId) => {
  return {
    type: ADD_IMAGE,
    payload: {
      image,
      spotId
    }
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
    // console.log('single spot thunk', singleSpot)
    return singleSpot;
  }
  else {
    const errors = await res.json();
    return errors;
  }
}

// CLEARS SINGLE SPOT STATE
export const unloadSingleSpotThunk = () => async (dispatch) => {
  dispatch(unloadSingleSpot())
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

// export const uploadImages = (images, spotId) => async dispatch => {
//   const formData = new FormData();
//   Array.from(images).forEach(image => formData.append("images", image));
//   const response = await csrfFetch(`/api/images/${spotId}`, {
//     method: "POST",
//     body: formData
//   });
//   if (response.ok) {
//     const data = await response.json();
//     dispatch(receiveImages(data));
//   }
//   return response;
// };

// Add Image Thunk
export const addImageThunk = (imageArr, spotId) => async (dispatch) => {
    console.log('imageArr here-------', imageArr, 'spotID here -----', spotId)
    const formData = new FormData();
    Array.from(imageArr).forEach(image => formData.append("images", image));
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(addImage(data, spotId))
    }
    // return response;
    else {
      const errors = await response.json();
      return errors;
    }
    // imageArr.forEach(async (imageObj) => {
    //   if (imageObj.url !== '') {
    //     const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify(imageObj)
    //     })
    //     if (res.ok) {
    //       const newImage = await res.json();
    //       dispatch(addImage(newImage, spotId))
    //     }
    //   }

    // })

    // console.log('image here backend -------', image)
    // console.log('spot ID backend -----', spotId)
    // const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(image)
    // })
    // console.log('response backend----', res)
    // if (res.ok) {
    //   console.log('i am running this works res ok')
    //   const newImages = await res.json();
    //   dispatch(addImage(newImages, spotId));
    //   return newImages;
    // }
  // catch (error) {
  // const errors = await error.json();
  // return errors;
// }
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
      // console.log('log in the res ok if block')
      const updatedSpot = await res.json();
      dispatch(editSpot(updatedSpot));
      return updatedSpot;
    } else {
      const errors = await res.json();
      return errors;
    }
  }
  catch (error) {
    // console.log('errors in edit spot thunk', error)
    const errors = await error.json();
    return errors;
  }
}

// Delete a Spot
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
      newState = { ...state};
      // console.log('get sigle spot', action.spot)
      newState.singleSpot = action.spot
      return newState;
    case UNLOAD_SINGLESPOT:
      newState = {...state};
      newState.singleSpot = {};
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
      newState = structuredClone(state);
      newState.singleSpot = {};
      delete newState.allSpots[action.spotId]
      return newState;
    case ADD_IMAGE:
      // newState = structuredClone(state);
      newState = structuredClone(state)
      // console.log('new state here -----', newState)
      // console.log('action over here ------', action, 'action payload over here ----', action.payload)
      // newState.singleSpot.SpotImages[action.payload.image.id] = action.payload.image;
      if (state.singleSpot?.SpotImages) {
        newState.singleSpot.SpotImages = [...state.singleSpot.SpotImages]
      }
      else {
        newState.singleSpot.SpotImages = []
      }
      newState.singleSpot.SpotImages.push(action.payload.image)
      // console.log('new state here -----', newState)
      return newState;
    default:
      return state;
  }
}

export default spotsReducer;
