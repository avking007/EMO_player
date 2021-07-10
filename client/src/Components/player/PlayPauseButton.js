import React from "react";
import { IconButton, CircularProgress } from "@material-ui/core/";
import {
  PauseCircleFilled,
  PlayCircleFilled,
  Pause,
  PlayArrow
} from "@material-ui/icons/";

const PlayPauseButton = ({ player, audioState, minimized, changeAudioState }) => {
  const togglePlayPause = e => {
    if (audioState === "playing") {
      // player?.pause();
      changeAudioState('paused');
    } else if (audioState === "paused") {
      changeAudioState('playing');
      // player?.play();
    }
    e.stopPropagation();
  };

  const showPlayPause = () => {
    if (audioState === "playing") {
      // if the state will be minimized then we will return the nromal pause button
      if (minimized) {
        return <Pause style={{ fontSize: "3em", opacity: ".8", color:"#fff" }} />;
      }
      return <PauseCircleFilled style={{ fontSize: "4em" , color:"#fff"}}/>;
    } else if (audioState === "paused" || audioState === "loaded") {
      if (minimized) {
        return <PlayArrow style={{ fontSize: "3em", opacity: ".8", color:"#fff" }} />;
      }
      return <PlayCircleFilled style={{ fontSize: "4em", color:"#fff" }}/>;
    } else if (audioState === "loading") {
      return <CircularProgress />;
    }
  };

  return (
    <IconButton
      size="small"
      style={{color: "#fff"}}
      aria-label="Pause"
      onClick={togglePlayPause}
      disableFocusRipple={true}
      disableRipple={true}
    >
      {showPlayPause()}
    </IconButton>
  );
};

export default PlayPauseButton;
