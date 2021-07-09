import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  LinearProgress,
  withStyles
} from "@material-ui/core/";
import { connect } from "react-redux";

import {
  GetApp,
  Reply,
  DoneOutline,
  Close,
} from "@material-ui/icons/";
import VolumeController from "./VolumeController";
import { useSongMethods } from "../RenderDatabase";
import { GlobalContext } from "../GlobalState";
import { closeCurrentSong } from "../../actions/songs";
import { useParams } from "react-router-dom";

const DownloadLoader = withStyles({
  root: {
    height: 2,
    width: "70%",
    margin: "0 auto",
    transform: "translateY(-10px)"
  }
})(LinearProgress);

const TopBar = ({ song, history, closeCurrentSong, volumeController }) => {
  const { snackbarMsg } = useContext(GlobalContext);
  const [isSongDownloaded, setSongDownloaded] = useState(false);
  const [isSongDownloading, setSongDownloading] = useState(false);
  const { mood } = useParams();

  const {
    handleDownload,
    handleRemoveSong,
    deleteDialogComponent
  } = useSongMethods();

  useEffect(() => {
    if (snackbarMsg === "Song Downloaded" || song?.audio) {
      setSongDownloaded(true);
      setSongDownloading(false);
    }
  }, [snackbarMsg, song]);
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
      {deleteDialogComponent}
      <Reply
        style={{ transform: " scaleX(-1) translateY(-2px)", color: "#fff" }}
        onClick={shareSong}
        color="primary"
      />

      <div>
        {isSongDownloaded ? (
          <DoneOutline
            style={{ color: "#fff" }}
            onClick={() => handleRemoveSong(song?.id || song?.songId)}
          /> //song will be removed
        ) : (
          <>
            <GetApp
              style={{ color: "#fff" }}
              onClick={() => {
                handleDownload(song?.id || song?.songId);
                setSongDownloading(true);
              }}
            />
          </>
        )}
        {isSongDownloading ? <DownloadLoader color="primary" /> : null}
        {/* if the song is downloading we will show loading */}
      </div>

      <Close onClick={handleClosePlayer} fontSize="large" style={{ color: "#fff", cursor: "pointer", paddingRight: '10px', transform: "translateY(-7px)" }} />

    </Grid>
  );
};

export default connect(null, { closeCurrentSong })(TopBar);
