import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import SignIn from "./Compenents/Auth/SignIn/SignIn";
import SignUp from "./Compenents/Auth/SignUp/SignUp";
import SimpleAppBar from "./Compenents/Layout/SimpleAppBar";
import SwipeMenu from "./Compenents/Layout/SwipeMenu";

const Routes = () => {
  return (
    <BrowserRouter>
      <SimpleAppBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        {/* <Route path="/user/dashboard" exact component={SimpleAppBar} /> */}
      </Switch>
      <SwipeMenu />
    </BrowserRouter>
  );
};

export default Routes;
