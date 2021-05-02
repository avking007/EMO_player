import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Components/layout/Home";
import SignIn from "./Components/auth/SignIn/SignIn";
import SignUp from "./Components/auth/SignUp/SignUp";
import MoodDetector from "./Components/MoodDetector/MoodDetector";
import SimpleAppBar from './Components/layout/SimpleAppBar';
import SwipeMenu from './Components/layout/SwipeMenu';
import CurrentSection from './Components/CurrentSection'
import { GlobalState } from "./Components/GlobalState";

const Routes = () => {
    return (
        <BrowserRouter>
            <SimpleAppBar />
            <SwipeMenu />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signin" exact component={SignIn} />
            <Route path="/signup" exact component={SignUp} />
            <Route path="/home" exact component={CurrentSection} />
            <Route path="/mood" component={MoodDetector} exact/>
          </Switch>
      </BrowserRouter>
  );
};

export default Routes;
