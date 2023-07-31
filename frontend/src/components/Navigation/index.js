import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='navigation-list'>
      <li className='navigation-bar home-link'>
        <NavLink exact to="/"><i class="fa-solid fa-basketball fa-2xl" style={{color: 'orange'}}></i>BallBnB</NavLink>
      </li>
      {sessionUser && isLoaded ? (
        <div id="user-logged-in-profile">
        <li className='create-new-spot-link'>
          <NavLink to='/api/spots'>Create a New Spot</NavLink>
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
