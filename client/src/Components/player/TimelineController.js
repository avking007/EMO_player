import React, { useState, useEffect } from 'react';
import { withStyles, Typography, Grid, Slider } from '@material-ui/core/';

const PrettoSlider = withStyles({
  root: {
    height: 6,
  },
  thumb: {
    height: 16,
    width: 16,
    marginTop: -5.3,
    marginLeft: -8,
    '&::before': {
      content: "''",
      height: 'inherit',
      width: 'inherit',
      position: 'absolute',
      transform: 'scale(1.6)',
      borderRadius: '50px',
      border: '1px solid', 
    },
  },
  track: {
    height: 6,
    borderRadius: 4,
    color: "#fff"
  },
  rail: {
    height: 6,
    borderRadius: 4,
  },
})(Slider);

const MiniSlider = withStyles({
  root: {
    height: 4,
    position: 'relative',
    bottom: '16px',
    color: '#FFFDFD',
    padding: 0,
  },
  thumb: {
    display: 'none',
  },
  track: {
    height: 4,
    borderRadius: 0,
  },
  rail: {
    height: 4,
    borderRadius: 0,
  },
})(Slider);

const formatTime = (secs) => {
  let minutes = Math.floor(secs / 60);
  let seconds = Math.ceil(secs - minutes * 60);

  if (seconds < 10) seconds = `0${seconds}`;

  return `${minutes}:${seconds}`;
};

const TimelineController = ({ audioState, player, minimized }) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setCurrentTime(player.current.getCurrentTime());
    // we will update the time of player every 800ms
    let setTimeInterval;
    if (audioState === 'playing') {
      setTimeInterval = setInterval(() => {
        setCurrentTime(player.current.getCurrentTime());
      }, 500);
    } else {
      clearInterval(setTimeInterval);
    }
    return () => clearInterval(setTimeInterval);
  }, [audioState, player]);

  const handleChange = (event, newValue) => {
    setCurrentTime(newValue);
    player.current.seekTo(newValue);
  };

  const showDuration = () => {
    if (player) {
      if (player.current?.getDuration()) {
        return formatTime(player.current.getDuration());
      } else {
        return '0:00';
      }
    } else {
      return 0;
    }
  };

  // condition rendering
  if (minimized) {
    return (
      <MiniSlider value={currentTime} max={player?.current?.getDuration() || 0} />
    );
  } else {
    return (
      <div style={{ margin: '0 auto', width: '90%' }}>
        <Grid container direction="row" justify="space-between">
          <Typography variant="body1" style={{color: "#fff"}}>
            {formatTime(currentTime)}
          </Typography>
          <Typography variant="body1" style={{color: "#fff"}}>
            {showDuration()}
          </Typography>
        </Grid>

        <PrettoSlider
          value={currentTime}
          onChange={handleChange}
          max={player?.current?.getDuration() || 0}
        />
      </div>
    );
  }
};

export default TimelineController;
