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
        <NavLink exact to="/"><i class="fa-solid fa-house fa-xl" style={{color: 'blue'}}></i></NavLink>
      </li>
      {isLoaded && (
        <li className='navigation-bar'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
