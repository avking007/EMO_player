import React from "react";
import { Grid } from "@material-ui/core/";
import { connect } from "react-redux";

import {
  Reply,
  Close,
} from "@material-ui/icons/";
import VolumeController from "./VolumeController";
import { closeCurrentSong } from "../../actions/songs";
import { useParams } from "react-router-dom";

const TopBar = ({ song, history, closeCurrentSong, volumeController }) => {
  const { mood } = useParams();
  // if the song is downloaded we will change

  // share prompt using chrome web api
  const shareSong = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Share This Song",
          text: `Hey Listen to ${song.title} on Ylight Music`,
          url: window.location.href //get the current window url
        })
        .then(() => console.log("Successful share"))
        .catch(error => console.log("Error sharing", error));
    }
  };

  const handleClosePlayer = () => {
    closeCurrentSong();
    if (mood) {
      history.push(`/mood/${mood}`)
    } else {
      history.push('/home');
    }
  };

  return (
    <Grid
      container
      justify="space-between"
      direction="row"
      style={{
        padding: " 0 10px",
        marginTop: "10px",
        position: "absolute",
        top: "0"
      }}
    >
      <VolumeController handleVolumeLevel={volumeController} />
      <Reply
        style={{ transform: " scaleX(-1) translateY(-2px)", color: "#fff" }}
        onClick={shareSong}
        color="primary"
      />
      <Close onClick={handleClosePlayer} fontSize="large" style={{ color: "#fff", cursor: "pointer", paddingRight: '10px', transform: "translateY(-7px)" }} />

    </Grid>
  );
};

export default connect(null, { closeCurrentSong })(TopBar);
