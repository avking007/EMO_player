import React, { useState, useContext, useEffect, useCallback } from "react";

import {
  SwipeableDrawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import {
  Info,
  People,
} from "@material-ui/icons";

import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";

import { GlobalContext } from "../GlobalState";
import "./darkMode.css";
import moon from "../images/moon-solid.svg";
import sun from "../images/sun-solid.svg";

const styles = {
  backgroundColor: "#b3b3b3",
  text: {
    color: "		#121212",
  },
  icon: {
    color: "	#1db954",
  },
};

const SwipeMenu = () => {
  const [{ menuOpen, themeSelectValue }, dispatch] = useContext(GlobalContext);

  const setMenuOpen = (data) => {
    dispatch({ type: "setMenuOpen", snippet: data });
  };

  const setThemeSelectValue = useCallback(
    (data) => {
      dispatch({ type: "setThemeSelectValue", snippet: data });
    },
    [dispatch]
  );

  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    if (themeSelectValue === "Dark") {
      setIsNight(true);
    } else {
      setIsNight(false);
    }
  }, [themeSelectValue]);

  const changeTheme = (theme) => {
    setThemeSelectValue(theme);
    localStorage.setItem("selectedTheme", theme);
  };

  const handleThemeToggle = () => {
    if (!isNight) {
      changeTheme("Dark");
      setIsNight(false);
    } else {
      changeTheme("Default");
      setIsNight(true);
    }
  };

  return (
    <SwipeableDrawer
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      onOpen={() => setMenuOpen(true)}
    >
      <div style={{ width: "300px", backgroundColor: "	#535353", height: "100%" }}>
        <div
          style={{
            margin: "35px",
            position: "relative",
            width: "30px",
            height: "30px",
          }}
        >
          <AnimatePresence>
            <motion.img
              key={isNight ? sun : moon}
              initial={{ scale: 0 }}
              animate={{ scale: 1.5, rotate: "360deg" }}
              exit={{ scale: 0 }}
              // transition={{ duration: 0.5 }}
              src={isNight ? sun : moon}
              onClick={() => handleThemeToggle()}
              className="dayNightToggleBtn"
              alt="sun moon icon"
            />
          </AnimatePresence>
        </div>

        <Divider />

        <List
          component="nav"
          className={"pinkLists"}
          onClick={() => setMenuOpen(false)}
          style={{ backgroundColor: "#535353" }}
        >
          <ListItem button component={Link} to="/contributors" style={styles}>
            <ListItemIcon>
              <People style={styles.icon} />
            </ListItemIcon>
            <ListItemText primary="Contributors" style={styles.text} />
          </ListItem>
          <ListItem button component={Link} to="/privacy" style={styles}>
            <ListItemIcon>
              <Info style={styles.icon} />
            </ListItemIcon>
            <ListItemText primary="Privacy & Policy" style={styles.text} />
          </ListItem>
        </List>
      </div>
    </SwipeableDrawer>
  );
};

export default SwipeMenu;
