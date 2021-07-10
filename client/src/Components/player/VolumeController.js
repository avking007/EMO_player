import React, { useState } from "react";
import { Grid, Slider } from "@material-ui/core/";
import { VolumeUp } from "@material-ui/icons/";

const VolumeController = ({ handleVolumeLevel }) => {
  const [volume, setVolume] = useState(100);

  const volumeChange = (e, newVal) => {
    setVolume(newVal);
    const playerNewVolume= newVal / 100;
    handleVolumeLevel(playerNewVolume);
    //
  };


  return (

      <Grid container spacing={1} style={{ maxWidth: "200px" }}>
        <Grid item>
          <VolumeUp style={{color: "#fff"}} />
        </Grid>
        <Grid item xs={3}>
          <Slider style={{color: "#fff"}} value={volume} onChange={volumeChange} />
        </Grid>
      </Grid>
  );
};

export default VolumeController;
