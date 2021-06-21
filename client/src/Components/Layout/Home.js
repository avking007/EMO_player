import Menu from "../../core/Menu";
import React from "react";
import "../../App.css";

const Home = () => {
  return (
    <div className="container-fluid p-4">
      <div className="bg-dark text-white p-4">

        <div className="Block_one">
          <h1>
            <span className="Main"> EMO </span>
            <br></br>Welcomes you to it's world..
          </h1>
          <p>
            {" "}
            (An application that suggest songs based on your mood by capturing
            facial expressions.)
          </p>
          <span className="text-muted">An amazing site for music fanatics..</span>
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Home;
