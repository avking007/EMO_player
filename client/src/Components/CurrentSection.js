import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from "react";

import { withRouter, Switch } from "react-router-dom";

import { Grid, CircularProgress } from "@material-ui/core";

import { GlobalContext } from "./GlobalState";
import {
  getHistory,
  getLikedSongs,
  db,
} from "../external/saveSong";

// import the db from save song
import PrivateRoute from "./Routes/PrivateRoute";
// pages
const RenderDatabase = lazy(() => import("./RenderDatabase"));
const SearchResult = lazy(() => import("./SearchResult"));
const HomePage = lazy(() => import("./sections/HomePage"));

const CurrentSection = ({ history, location }) => {
  const [{ searchResult }] = useContext(GlobalContext);
  const [songsHistoryState, setSongsHistory] = useState([]);
  const [songsLikedState, setSongsLiked] = useState([]);
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

  }, [history, location]);

  return (
    <div>
      <Suspense fallback={circularLoader}>
        <Switch>
          <PrivateRoute
            path="/search"
            render={(props) => <SearchResult {...props} videos={searchResult} />}
          />
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
            path="/history"
            render={(props) => {
              setTabValue(2);
              return <RenderDatabase songs={songsHistoryState} {...props} />;
            }}
          />
        </Switch>
      </Suspense>
    </div>
  );
};

export default withRouter(CurrentSection);
