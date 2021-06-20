import React from "react";

import { Button, Grid, Typography } from "@material-ui/core";
import { NavigateNext } from "@material-ui/icons";
import bgImg from "../images/music-bg.svg";
import handcraftedText from "../images/craftedImg.png";


const bgStyle = {
  background: `url(${bgImg}) no-repeat`,
  backgroundPositionX: "50%",
  width: "100vw",
  height: "46vh"
};



const LoginPage = ({ continueToHome }) => {

  return (
    <Grid
      style={{ height: "80vh" }}
      container
      direction="column"
      justify="space-around"
      alignItems="center"
    >

      <div style={bgStyle} />

      <Typography
        variant="h6"
        color="primary"
        align="center"
        style={{ padding: "10px" }}
      >
        Listen to unlimited songs without any ads for free only on Ylight Music
      </Typography>
      <img
        style={{
          width: "70vw",
          maxWidth: "350px"
        }}
        src={handcraftedText}
        alt="Handcrafted by Shivam"
      />
      <Button variant="outlined" color="primary" onClick={continueToHome}>
        Continue
        <NavigateNext />
      </Button>
    </Grid>
  );
};

export default LoginPage;
