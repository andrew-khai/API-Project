import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const loginDemo = (e) => {
    setCredential('Demo-lition');
    setPassword('password')

    // await handleSubmit(e);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1 className="login-signup">Log In</h1>
      <form id="login-form" onSubmit={handleSubmit}>
        <label>
          <input
            className="login-input"
            placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className="errors">{errors.credential}</p>
        )}
        <button
        id="login-button"
        type="submit"
        disabled={credential.length < 4 || password.length < 6}
        >Log In</button>
        <button
        id="demo-login-button"
        onClick={loginDemo}
        >Log in as Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
