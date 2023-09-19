import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SingleSpotShow from "./components/SingleSpotShow";
import CreateASpotForm from "./components/Forms/CreateASpotForm";
import ManageSpots from "./components/ManageSpots/ManageSpots";
import EditSpotForm from "./components/Forms/EditSpotForm";
import ReviewModal from "./components/ReviewModal";
import ManageReviews from "./components/ManageReviews";

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
            <CreateASpotForm />
          </Route>
          <Route path="/spots/current" exact>
            <ManageSpots />
          </Route>
          <Route exact path="/reviews/current">
            <ManageReviews />
          </Route>
          <Route path="/spots/:spotId" exact>
            <SingleSpotShow />
          </Route>
          <Route path='/spots/:spotId/edit'>
            <EditSpotForm />
          </Route>
          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>}
    </>
  );
}

export default App;
