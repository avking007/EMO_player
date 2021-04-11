import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import SignIn from "./Compenents/Auth/SignIn/SignIn";
import SignUp from "./Compenents/Auth/SignUp/SignUp";
import UserDashboard from "./Compenents/Layout/UserDashboard";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/user/dashboard" exact component={UserDashboard} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
