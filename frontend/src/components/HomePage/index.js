import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import SingleSpotItem from "../SpotItemDetails";
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
          <SingleSpotItem
            spot={spot}
            key={spot.id}
          />
        ))
        }
      </div>
    </>
  )
}

export default HomePage;
