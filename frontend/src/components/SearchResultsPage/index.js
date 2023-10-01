import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unloadAllSpotsThunk } from "../../store/spots";
import SingleSpotItem from "../SpotItemDetails";
import "./SearchResultsPage.css"
import { useLocation } from "react-router-dom";

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const city = searchParams.get('city');
  const state = searchParams.get('state');
  const country = searchParams.get('country');

  useEffect(() => {
    dispatch(unloadAllSpotsThunk());
  }, [dispatch])
  const spots = useSelector(state => Object.values(state.spots.allSpots))
  console.log('spots', spots)
  return (
    <div id="main-results-container">
      <div id="results-header" style={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <h1>Search Results:</h1>
        {city && (
          <h2>
            <span>City: </span> <strong className="boxed-results">{city}</strong>
          </h2>
        )}
        {state && (
          <h2>
            <span>State: </span> <strong className="boxed-results">{state}</strong>
          </h2>
        )}
        {country && (
          <h2>
            <span>Country: </span> <strong className="boxed-results">{country}</strong>
          </h2>
        )}
      </div>
      {spots && spots.length > 0 ?
        <div id="spots-container">
          {/* <h2>Spots: <strong className="boxed-results">{spots.length}</strong></h2> */}
          {spots.map(spot => (
            <SingleSpotItem spot={spot} key={spot.id} />
          ))}
        </div>
        :
        <h2 style={{ textAlign: "center" }}>No spots found. Search again or go to <a style={{color: "orange", textDecoration: "none"}} href="/">homepage</a></h2>
      }
    </div>
  )
}

export default SearchResultsPage;
