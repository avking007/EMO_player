import React from "react";
import { IconButton } from "@material-ui/core/";
import { SkipNext } from "@material-ui/icons/";

const PlayPauseButton = ({onPlayNext}) => {
  return (
    <IconButton aria-label="Next" onClick={onPlayNext} style={{color: '#fff'}}>
      <SkipNext fontSize="large"/>
    </IconButton>
  );
};

export default PlayPauseButton