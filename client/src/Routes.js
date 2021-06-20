import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import SimpleAppBar from "./Components/Layout/SimpleAppBar";
import SwipeMenu from "./Components/Layout/SwipeMenu";
import CurrentSection from "./Components/CurrentSection";

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
