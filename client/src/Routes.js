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
import MoodPlayer from "./Components/MoodDetector/MoodPlayer/MoodPlayer";
import BottomMenu from "./Components/Layout/BottomMenu";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import MoodPlaylist from "./Components/MoodDetector/MoodPlaylist/MoodPlaylist";
import MainPlayer from "./Components/player/MainPlayer";
import Alert from "./Components/Layout/Alert";

const Routes = () => {

  return (
    <BrowserRouter>
      <SimpleAppBar />
      <Alert />
      <Switch>
        <Route path="/" component={LandingPage} exact />
        <Route path="/signin" component={SignIn} exact />
        <Route path="/signup" component={SignUp} exact />
        <PrivateRoute path="/mood" component={MoodDetector} exact />
        <Route path="/settings" component={SettingsPage} exact />
        <Route path="/privacy" component={PrivacyPage} exact />
        <Route path="/contributors" component={ContributorsPage} exact />
        <PrivateRoute path="/mood/:mood" component={MoodPlaylist} exact />
        <PrivateRoute path="/mood/:mood/:songId" component={MoodPlayer} exact />
        <PrivateRoute path="/play/:songId" component={MainPlayer} exact />
        <Route component={CurrentSection} />

      </Switch>
      <BottomMenu />
      <SwipeMenu />
    </BrowserRouter>
  );
};

export default Routes;
