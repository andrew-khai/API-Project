import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { singleSpotThunk } from "../../store/spots";

const SingleSpotShow = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(singleSpotThunk(spotId))
  }, [dispatch, spotId])

  const spot = useSelector(state => state.spots.singleSpot[spotId])

  // console.log('spot', spot)
  return (
    <div id="spot-details-container">
      <h2>{spot.name}</h2>
      <h3>{spot.city}, {spot.state}, {spot.country}</h3>

    </div>
  )
}


export default SingleSpotShow;
