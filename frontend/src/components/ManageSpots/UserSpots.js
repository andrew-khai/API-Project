import React from 'react';
import { NavLink } from 'react-router-dom';
import noImage from '../../images/no-picture-available.png'
import './UserSpots.css'

const UserSpots = ({ spot }) => {
  return (
    <>
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
        <div id='update-delete-container'>
          <button>Update</button>
          <button>Delete</button>
        </div>
      </div>
    </>
  )
}

export default UserSpots;
