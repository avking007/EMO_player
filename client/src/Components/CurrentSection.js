import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from "react";

import {
  withRouter,
  Route,
  Link,
  Switch,
} from "react-router-dom";

import {
  Tabs,
  Tab,
  withStyles,
  Grid,
  CircularProgress,
} from "@material-ui/core";

import {
  Home,
  Favorite,
  History,
  GetApp,
} from "@material-ui/icons/";

import { GlobalContext } from "./GlobalState";
import {
  getHistory,
  getLikedSongs,
  getDownloadedSongs,
  removeDownloadingState,
  db,
} from "../external/saveSong";

import SettingsPage from "./sections/SettingsPage";
// import the db from save song
import MainPlayer from "./player/MainPlayer";
import MoodDetector from "./MoodDetector/MoodDetector";
import SignUp from "./auth/SignUp/SignUp";
import SignIn from "./auth/SignIn/SignIn";
import PrivateRoute from "./Routes/PrivateRoute";
// pages
const LandingPage = lazy(() => import("../Components/Layout/Home"));
const LoginPage = lazy(() => import("./LoginPage"));
const RenderDatabase = lazy(() => import("./RenderDatabase"));
const SearchResult = lazy(() => import("./SearchResult"));
const HomePage = lazy(() => import("./sections/HomePage"));
const FeedbackForm = lazy(() => import("./sections/FeedbackForm"));
const PrivacyPage = lazy(() => import("./sections/PrivacyPage"));
// const DonatePage = lazy(() => import("./sections/DonatePage"));
const ContributorsPage = lazy(() => import("./sections/ContributorsPage"));

// custom styling the tab menus
const CustomTab = withStyles({
  root: {
    background: "#191414",
    position: "fixed",
    bottom: "0",
    padding: 0,
    width: "100%",
    zIndex: 1300,
  },
  indicator: {
    display: "none",
  },
  labelIcon: {
    margin: 0,
  },
})(Tabs);

const CustomTabs = withStyles({
  root: {
    color: "#1db954",
    fontWeight:"bold",
    fontSize: ".75rem",
    margin: 0,

    "&:hover": {
      color: "#e4e6eb",
      textDecoration:"none",
      opacity: 1,
    },
    "&$selected": {
      color: "#b3b3b3",
    },
    "&:focus": {
      color: "#b3b3b3",
    },
  },

  selected: {},
})(Tab);

let deferredPrompt = undefined;
let previousLocation;

window.addEventListener("beforeinstallprompt", (e) => {
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

const CurrentSection = ({ history, location }) => {
  const [{ currentVideoSnippet, searchResult }] = useContext(GlobalContext);
  // console.log(currentVideoSnippet);

  const [songsHistoryState, setSongsHistory] = useState([]);
  const [songsLikedState, setSongsLiked] = useState([]);
  const [songsDownloadedState, setSongsDownloaded] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [redirectState, setRedirectState] = useState(null);

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

  function handleChange(event, newValue) {
    setTabValue(newValue);
  }

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
  //
  useEffect(() => {
    fetchSongs();
  }, [tabValue, fetchSongs]);

  useEffect(() => {
    fetchSongs();
    // console.log("fetching the songs");
  }, [updateCount, fetchSongs]);

  useEffect(() => {
    db.on("changes", () => {
      setUpdateCount((c) => c + 1);
    });
    // will remove all the songs which are downloading in the first place
    removeDownloadingState();

    const isThisNewUser = localStorage.getItem("isThisNew");
    if (isThisNewUser === "no") {
      setRedirectState(true);
    }
    // if this is not a new user redirect it to home
    previousLocation = location;
    history.listen((location) => {
      if (location.pathname !== "/play") {
        previousLocation = location;
        // console.log(previousLocation);
      }
    });
  }, [history, location]);

  useEffect(() => {
    // we will redirect everytime user comes to root page
    if (redirectState && history.location.pathname === "/") {
      history.replace("/home");
    }
    // if the location is not play then we will push new location
  }, [setRedirectState, history, redirectState]);

  const checkPrevLocation = () => {
    if (location.pathname === "/play") {
      return previousLocation;
    } else {
      return location;
    }
  };

  // we will load the homepage with all the playlists
  const continueToHome = () => {
    localStorage.setItem("isThisNew", "no");
    history.replace("/home");

    if (deferredPrompt) {
      // show the prompt to install app
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // console.log("User accepted the A2HS prompt");
        } else {
          // console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    }
  };

  const returnMainPlayer = (props) => {
    // we will return the main player if the path is not the "/"

    if (window.location.pathname !== "/") {
      return <MainPlayer {...props} />;
    } else {
      return null;
    }
  };

  // the set tab value will keep the tab active on their route
  // there are 4 tabs so there will be 3 indexes
  return (
    <div>
      <Suspense fallback={circularLoader}>
        <Switch location={checkPrevLocation()}>
          <Route path="/" exact component={LandingPage} />
          <Route path="/signin" exact component={SignIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/mood" component={MoodDetector} exact />

          <Route
            exact
            path="/"
            render={(props) => {
              return <LoginPage continueToHome={continueToHome} />;
            }}
          />
          <PrivateRoute
            path="/search"
            render={(props) => <SearchResult videos={searchResult} />}
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
              return (
                <RenderDatabase
                  songs={songsLikedState}
                  {...props}
                  key={location.pathname}
                />
              );
            }}
          />
          <PrivateRoute
            path="/downloads"
            render={(props) => {
              setTabValue(2);
              return (
                <RenderDatabase
                  songs={songsDownloadedState}
                  key={location.pathname}
                />
              );
            }}
          />
          <PrivateRoute
            path="/history"
            render={(props) => {
              setTabValue(3);
              return (
                <RenderDatabase
                  songs={songsHistoryState}
                  key={location.pathname}
                />
              );
            }}
          />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/privacy" component={PrivacyPage} />

          <Route path="/feedback" component={FeedbackForm} />

          <Route path="/contributors" component={ContributorsPage} />
        </Switch>
        <Route path="/" render={(props) => returnMainPlayer(props)} />

        <div style={{ height: currentVideoSnippet.id ? "100px" : "50px" }} />
      </Suspense>
      {/* if the player is on then return 100px else 50px*/}
      <CustomTab
        value={tabValue}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <CustomTabs
          icon={<Home />}
          aria-label="Home"
          component={Link}
          to="/home"
          label="Home"
        />

        <CustomTabs
          icon={<Favorite />}
          aria-label="Liked"
          component={Link}
          to="/liked"
          label="Liked"
        />

        <CustomTabs
          icon={<GetApp />}
          aria-label="Downloads"
          component={Link}
          to="/downloads"
          label="Downloads"
        />
        <CustomTabs
          icon={<History />}
          aria-label="History"
          component={Link}
          to="/history"
          label="History"
        />
      </CustomTab>
    </div>
  );
};

export default withRouter(CurrentSection);
