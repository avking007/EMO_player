import React from "react";
import { Link, withRouter } from "react-router-dom";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#b0b3b8" };
  } else {
    return { color: "white" };
  }
};

const Menu = ({ history }) => (
  <div style={{ textAlign: "center", padding: "40px" }}>
    <button style={{marginRight:"20px"}} className="btn  btn-success p-2">
      <Link
        style={currentTab(history, "/signup")}
        className="nav-link"
        to="/signup"
      >
        Signup
      </Link>
    </button>
    <button className="btn  btn-success p-2">
      {" "}
      <Link
        style={currentTab(history, "/signin")}
        className="nav-link"
        to="/signin"
      >
        Signin
      </Link>
    </button>
  </div>
);

export default withRouter(Menu);
