import React from 'react';
import { NavLink } from 'react-router-dom';
import "./SpotItemDetails.css"
import noImage from '../../images/no-picture-available.png'

const SingleSpotItem = ({ spot }) => {
  // console.log('spot', spot)
  // console.log('spot image', spot.previewImage)
  // console.log(typeof spot.previewImage)
  // console.log('require', require('../../images/placeholder-picture.png'))
  return (
    <div className="spots-boxes" key={spot.id}>
      <NavLink to={`/spots/${spot.id}`}>
        <img className="spots-boxes-image" src={spot.previewImage || noImage} alt={spot.name}></img>
        <div className="spots-boxes-details">
          <div className="spots-location-ratings">
            <div className="spots-boxes-city-state">{spot.city}, {spot.state}</div>
            <div className="spots-boxes-ratings"><i className="fa-solid fa-star fa-xs"></i> {spot.avgRating || "New"}</div>
          </div>
          <div className="spots-boxes-price">${spot.price}<span className="day-text"> /day</span></div>
        </div>
      </NavLink>
    </div>
  )
}

export default SingleSpotItem;
