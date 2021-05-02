import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Components/Layout/Home";
import SignIn from "./Components/auth/SignIn/SignIn";
import SignUp from "./Components/auth/SignUp/SignUp";
import SimpleAppBar from "./Components/Layout/SimpleAppBar";
import SwipeMenu from "./Components/Layout/SwipeMenu";
import CurrentSection from "./Components/CurrentSection";
import MoodDetector from "./Components/MoodDetector/MoodDetector";

const Routes = () => {
  return (
    <BrowserRouter>
      <SimpleAppBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/home" exact component={CurrentSection} />
        <Route path="/mood" component={MoodDetector} exact />
      </Switch>
      <SwipeMenu />
    </BrowserRouter>
  );
};

export default Routes;
