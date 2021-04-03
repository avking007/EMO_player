import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Signin from "./Signin";
import Signup from "./Signup";
import UserDashboard from "./UserDashboard";

const Routes = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />

          <Route path="/user/dashboard" exact component={UserDashboard} />

          

        </Switch>
    </BrowserRouter>
    );
  };
  
  export default Routes;