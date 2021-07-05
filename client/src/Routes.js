/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SimpleAppBar from "./Components/Layout/SimpleAppBar";
import SwipeMenu from "./Components/Layout/SwipeMenu";
import CurrentSection from "./Components/CurrentSection";
import LandingPage from "./Components/Layout/LandingPage";
import SignIn from "./Components/auth/SignIn/SignIn";
import SignUp from "./Components/auth/SignUp/SignUp";
import MoodDetector from "./Components/MoodDetector/MoodDetector";
import SettingsPage from "./Components/sections/SettingsPage";
import PrivacyPage from "./Components/sections/PrivacyPage";
import ContributorsPage from "./Components/sections/ContributorsPage";
import BottomMenu from "./Components/Layout/BottomMenu";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import MoodPlaylist from "./Components/MoodDetector/MoodPlaylist/MoodPlaylist";

const Routes = () => {

  return (
    <BrowserRouter>
      <SimpleAppBar />
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/mood" component={MoodDetector} exact />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/contributors" component={ContributorsPage} />
        <Route path="/mood/:mood" component={MoodPlaylist} exact/>
        <Route component={CurrentSection} />

      </Switch>
      <BottomMenu />
      <SwipeMenu />
    </BrowserRouter>
  );
};

export default Routes;
