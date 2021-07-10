import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { GlobalContext } from "../GlobalState";
import { connect } from 'react-redux';
import SearchBox from "./SearchBox";
import { logout } from "../../actions/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Slide,
} from "@material-ui/core/";

import useScrollTrigger from "@material-ui/core/useScrollTrigger";

import { Face, Menu, Search, ExitToApp } from "@material-ui/icons/";

const styles = {
  root: {
    flexGrow: 1,
  },
  title: {
    textAlign: "center",
    width: "calc(100% - 96px)",
    color: "	#1db954"
  },
  input: {
    color: "#fff",
  },
};

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function SimpleAppBar(props) {
  const [{ searchState }, dispatch] = useContext(GlobalContext);

  const setMenuOpen = (data) => {
    // console.log(data);
    dispatch({ type: "setMenuOpen", snippet: data });
  };
  const setSearchState = React.useCallback(
    (data) => {
      // console.log(data);
      dispatch({ type: "setSearchState", snippet: data });
    },
    [dispatch]
  );

  React.useEffect(() => {
    // if the page is on search we will change the search state
    const changeAppBar = () => {
      const path = props.history.location.pathname;
      if (path === "/search") {
        setSearchState("searching");
      } else {
        setSearchState("home");
      }
      // console.log("history change detected in app bar");
    };

    changeAppBar();
    props.history.listen((location) => {
      changeAppBar();
    });
  }, [setSearchState, props.history]);

  const toggleSearch = () => {
    if (searchState === "home") {
      return (
        <>
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
            style={{ color: "	#1db954" }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" style={styles.title}>
            Emolight Music
          </Typography>
          <IconButton
            style={{ color: "	#1db954" }}
            onClick={() => props.history.push('/mood')}
          >
            <Face />
          </IconButton>
          <IconButton
            onClick={() => setSearchState("clicked")}
            color="inherit"
            aria-label="Search"
            style={{ color: "	#1db954" }}
          >
            <Search />
          </IconButton>
          {props.isAuthenticated && (
            <IconButton
              onClick={() => props.logout()}
              color="inherit"
              aria-label="Search"
              style={{ color: "	#1db954" }}
            >
              <ExitToApp />
            </IconButton>
          )}

        </>
      );
    } else {
      return <SearchBox />;
    }
  };

  return (
    <>
      <HideOnScroll {...props}>
        <AppBar id="navbar" position="sticky" style={{ background: '	#121212' }}>
          <Toolbar>{toggleSearch()}</Toolbar>
        </AppBar>
      </HideOnScroll>
    </>
  );
}
const mapper = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapper, { logout })(withRouter(SimpleAppBar));
