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
  // getLikedSongs,
  db,
} from "../external/saveSong";

// import the db from save song
import PrivateRoute from "./Routes/PrivateRoute";
import { connect } from "react-redux";
// pages
const RenderDatabase = lazy(() => import("./RenderDatabase"));
const SearchResult = lazy(() => import("./SearchResult"));
const HomePage = lazy(() => import("./sections/HomePage"));

const CurrentSection = ({ userSongs, history, location }) => {
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
    const getHistorySongs = () => {
      const historySongs = [];
      for (let mood in userSongs) {
        historySongs.push(...userSongs[mood]);
      }
      return historySongs;
    }
    const getLikedSongs = () => {
      const likedSongs = [];
      for (let mood in userSongs) {
        userSongs[mood].forEach((song)=> {
          if (song.liked) {
            likedSongs.push(song);
          }
        });
      }
      return likedSongs;
    }
    switch (tabValue) {
      case 1:
        setSongsLiked(getLikedSongs());
        break;

      case 2:
        setSongsHistory(getHistorySongs());
        break;

      default:
        break;
    }
  }, [tabValue, userSongs]);

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

export const mapper = (state) => ({
  userSongs: state.song.songsArray
});
export default connect(mapper)(withRouter(CurrentSection));
