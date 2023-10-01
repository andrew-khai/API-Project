import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton';
import { getAllSpots } from '../../store/spots';
import { useHistory } from 'react-router-dom';

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  const handleSearch = () => {
    // Construct the search query based on user input
    const searchQuery = `?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}`;
    dispatch(getAllSpots(searchQuery));

    setCity('')
    setState('')
    setCountry('')
    history.push(`/search${searchQuery}`)

  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <ul id='navigation-list'>
      <li className='navigation-bar home-link'>
        <NavLink exact to="/">
          <div className='logo-and-icon'>
            <i className="fa-solid fa-basketball fa-2xl" style={{ color: 'orange' }}>
            </i>
            <div className='site-title'>BallBnB</div>
          </div>
        </NavLink>
      </li>
      <div id='searchbar-container'>
        <input
          className='searchbar-inputs city-input'
          type="text"
          placeholder="City"
          value={city}
          // disabled={true}
          onFocus={(e) => {
            e.target.placeholder = '';
          }}
          onBlur={(e) => {
            e.target.placeholder = 'City';
          }}
          onChange={(e) => setCity(e.target.value)}
        />
        <h2 className="navi-line">|</h2>
        <input
          className='searchbar-inputs city-input'
          type='text'
          placeholder="State"
          value={state}
          onFocus={(e) => {
            e.target.placeholder = '';
          }}
          onBlur={(e) => {
            e.target.placeholder = 'State';
          }}
          onChange={(e) => setState(e.target.value)}
        // disabled={true}
        />
        <h2 className="navi-line">|</h2>
        <input
          className='searchbar-inputs'
          type="text"
          placeholder="Country"
          value={country}
          onFocus={(e) => {
            e.target.placeholder = '';
          }}
          onBlur={(e) => {
            e.target.placeholder = 'Country';
          }}
          onChange={(e) => setCountry(e.target.value)}
        // disabled={true}
        />
        <button id="searchbar-button"
          disabled={!city && !state && !country}
          onClick={handleSearch}
        >
          <i class="fa-solid fa-magnifying-glass" style={{ color: "#ffffff" }}></i>
        </button>
      </div>
      {sessionUser && isLoaded ? (
        <div id="user-logged-in-profile">
          <li className='create-new-spot-link'>
            <NavLink to='/spots/new'>
            </NavLink>
          </li>
          <li className='navigation-bar'>
            <ProfileButton user={sessionUser} />
          </li>
        </div>
      ) : (
        <li className='navigation-bar'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
