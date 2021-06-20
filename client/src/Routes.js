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

      <Route component={CurrentSection} />

      <SwipeMenu />
    </BrowserRouter>
  );
};

export default Routes;
