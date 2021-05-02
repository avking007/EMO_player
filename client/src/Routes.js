import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import SignIn from "./Components/Auth/SignIn/SignIn";
import SignUp from "./Components/Auth/SignUp/SignUp";
import SimpleAppBar from "./Components/Layout/SimpleAppBar";
import SwipeMenu from "./Components/Layout/SwipeMenu";
import CurrentSection from "./Components/CurrentSection";

const Routes = () => {
  return (
    <BrowserRouter>
      <SimpleAppBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/home" exact component={CurrentSection} />
      </Switch>
      <SwipeMenu />
    </BrowserRouter>
  );
};

export default Routes;
