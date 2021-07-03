import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from "react";

import { withRouter, Route, Switch } from "react-router-dom";

import { Grid, CircularProgress } from "@material-ui/core";

import { GlobalContext } from "./GlobalState";
import {
  getHistory,
  getLikedSongs,
  getDownloadedSongs,
  removeDownloadingState,
  db,
} from "../external/saveSong";

// import the db from save song
import MainPlayer from "./player/MainPlayer";
import PrivateRoute from "./Routes/PrivateRoute";
import MoodPlaylist from "./MoodDetector/MoodPlaylist/MoodPlaylist";
// pages
const RenderDatabase = lazy(() => import("./RenderDatabase"));
const SearchResult = lazy(() => import("./SearchResult"));
const HomePage = lazy(() => import("./sections/HomePage"));

let previousLocation;

const CurrentSection = ({ history, location }) => {
  const [{ searchResult }] = useContext(GlobalContext);
  const [songsHistoryState, setSongsHistory] = useState([]);
  const [songsLikedState, setSongsLiked] = useState([]);
  const [songsDownloadedState, setSongsDownloaded] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);

  const circularLoader = (
    <Grid
      style={{ height: "109vh" }}
      container
      justify="center"
      alignItems="center"
    >
      <CircularProgress />
    </Grid>
  );

  const fetchSongs = useCallback(async () => {
    //it's same as the orders of our tabs
    switch (tabValue) {
      case 1:
        setSongsLiked(await getLikedSongs());
        break;

      case 2:
        setSongsDownloaded(await getDownloadedSongs());
        break;

      case 3:
        setSongsHistory(await getHistory());
        break;

      default:
        break;
    }
  }, [tabValue]);

  useEffect(() => {
    fetchSongs();
  }, [updateCount, tabValue, fetchSongs]);

  useEffect(() => {
    db.on("changes", () => {
      setUpdateCount((c) => c + 1);
    });
    removeDownloadingState();
  }, [history, location]);

  const checkPrevLocation = () => {
    if (location.pathname === "/play") {
      return previousLocation;
    } else {
      return location;
    }
  };

  return (
    <div>
      <Suspense fallback={circularLoader}>
        <Switch location={checkPrevLocation()}>
          <PrivateRoute
            path="/search"
            render={(props) => <SearchResult videos={searchResult} />}
          />
          <PrivateRoute path="/mood/:mood" component={MoodPlaylist} />
          <PrivateRoute
            path="/home"
            render={(props) => {
              setTabValue(0);
              return <HomePage />;
            }}
          />
          <PrivateRoute
            path="/liked"
            render={(props) => {
              setTabValue(1);
              return <RenderDatabase songs={songsLikedState} {...props} />;
            }}
          />
          <PrivateRoute
            path="/downloads"
            render={(props) => {
              setTabValue(2);
              return <RenderDatabase songs={songsDownloadedState} />;
            }}
          />
          <PrivateRoute
            path="/history"
            render={(props) => {
              setTabValue(3);
              return <RenderDatabase songs={songsHistoryState} />;
            }}
          />
        </Switch>
        <Route path="/" component={MainPlayer} />
      </Suspense>
    </div>
  );
};

export default withRouter(CurrentSection);
