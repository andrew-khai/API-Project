import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
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
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="profile-button" onClick={openMenu}>
        <div id="profile-button-details">
          <i class="fa-solid fa-bars"></i>
          <i class="fa-regular fa-user fa-lg" style={{ color: 'orange' }}></i>
        </div>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className="dropdown-list-container">
              <div className="user-information-container">
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
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
