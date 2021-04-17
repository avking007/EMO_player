import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Components/layout/Home";
import SignIn from "./Components/auth/SignIn/SignIn";
import SignUp from "./Components/auth/SignUp/SignUp";
import UserDashboard from "./Components/layout/UserDashboard";
import MoodDetector from "./Components/MoodDetector/MoodDetector";

const Routes = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signin" exact component={SignIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/user/dashboard" exact component={UserDashboard} />
          <Route path="/mood" component={MoodDetector}/>
        </Switch>
    </BrowserRouter>
    );
  };
  
  export default Routes;