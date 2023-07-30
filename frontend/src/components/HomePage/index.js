import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import './HomePage.css'

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])

  // type Object
  const allSpots = useSelector(state => state.spots.allSpots);

  // type Array
  const spots = Object.values(allSpots);

  return (
    <>
      <div id="spots-container">
        {spots.map(spot => (
          <div className="spots-boxes">
            <div className="spots-boxes-image">{spot.previewImage}</div>
            <div className="spots-boxes-details">
              <div className="spots-boxes-name">{spot.name}</div>
              <div className="spots-boxes-ratings"><i class="fa-solid fa-star fa-xs"></i> {spot.avgRating}</div>
              <div className="spots-boxes-city-state">{spot.city}, {spot.state}</div>
              <div className="spots-boxes-price">${spot.price}/day</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default HomePage;
