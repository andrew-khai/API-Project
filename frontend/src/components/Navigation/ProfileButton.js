import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="profile-button" onClick={openMenu}>
        <div id="profile-button-details">
          <i className="fa-solid fa-bars"></i>
          <i className="fa-regular fa-user fa-lg" style={{ color: '#f68d56' }}></i>
        </div>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className="dropdown-list-container-user">
              <div className="user-information-container">
                <li>Hello, {user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
              </div>
              <div className="manage-spots-link">
                <Link to="/spots/current" onClick={closeMenu}>Manage Spots</Link>
              </div>
              <div className="manage-spots-link">
                <Link to="/reviews/current" onClick={closeMenu}>Manage Reviews</Link>
              </div>
              <div className="manage-spots-link">
                <Link to="/bookings/current" onClick={closeMenu}>Manage Bookings</Link>
              </div>
              {/* li item for Manage Spots */}
              <li id="logout-button">
                <button onClick={logout}>Log Out</button>
              </li>
            </div>
          </>
        ) : (
          <>
            <div className="dropdown-list-container">
              <li className="login-signup-modal">
                <OpenModalButton
                  buttonText="Log In"
                  onButtonClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
              <li className="login-signup-modal">
                <OpenModalButton
                  buttonText="Sign Up"
                  onButtonClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
            </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
