import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getUserSpots } from "../../store/spots";
import SingleSpotItem from "../SpotItemDetails";
import UserSpots from "./UserSpots";
import { NavLink } from "react-router-dom";

const ManageSpots = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserSpots())
  }, [dispatch])

  const userSpots = useSelector(state => state.spots.allSpots);
  // console.log('user spots', userSpots);

  const spots = Object.values(userSpots);
  // console.log('spots', spots)


  return (
    <>
      <div id='manage-spots-container'>
        <h2>Manage Your Spots</h2>
        <NavLink to="/spots/new">
          <button id='create-new-spot-button'>Create a New Spot</button>
        </NavLink>
      </div>
      <div id="user-spots-container">
        {spots.map(spot => (
          <UserSpots
            spot={spot}
            key={spot.id}
          />
        ))}
      </div>
    </>
  )
}

export default ManageSpots;
