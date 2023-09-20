import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getUserSpots } from "../../store/spots";
import SingleSpotItem from "../SpotItemDetails";
import UserSpots from "./UserSpots";
import { NavLink } from "react-router-dom";

const ManageSpots = () => {
  const dispatch = useDispatch();

  useEffect(() => {

    if (sessionUser) {
      dispatch(getUserSpots())
    }
  }, [dispatch])

  const userSpots = useSelector(state => state.spots.allSpots);
  const sessionUser = useSelector(state => state.session.user);
  // console.log('user spots', userSpots);

  const spots = Object.values(userSpots).reverse();
  // console.log('spots', spots)
  if (!sessionUser) return (<><h1>Forbidden</h1></>)


  return (
    <>
      <div id='manage-spots-container'>
        <h2 style={{ textAlign: "center" }}>Manage Your Spots</h2>
        {!spots || spots.length === 0 &&
          <>
            <div id="no-spots-container">
              <div style={{ textAlign: "center", marginBottom: "10px" }}><i class="fa-solid fa-spinner fa-lg"></i></div>
              <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>No spots created...yet!</div>
              <div style={{ textAlign: "center", fontSize: "1rem" }}>Have a nice court? Create a spot here and share it with everyone!</div>
              <NavLink to="/spots/new">
                <button id='create-new-spot-button'>Create a New Spot</button>
              </NavLink>
            </div>
          </>
        }
      </div>
      <div id="user-spots-container">

        {spots && spots.map(spot => (
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
