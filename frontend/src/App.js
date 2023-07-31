import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SingleSpotShow from "./components/SingleSpotShow";
import SpotForm from "./components/SpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path='/spots/new'>
            <SpotForm />
          </Route>
          <Route path="/spots/:spotId" exact>
            <SingleSpotShow />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
