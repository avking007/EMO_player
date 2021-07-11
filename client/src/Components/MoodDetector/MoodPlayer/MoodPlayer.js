import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core/";

import TopBar from '../../player/TopBar';
import { ThumbDown } from "@material-ui/icons/";
import TimelineController from '../../player/TimelineController';
import ReactPlayer from 'react-player';

import PlayPauseButton from '../../player/PlayPauseButton';
import PreviousButton from '../../player/PreviousButton';
import NextButton from '../../player/NextButton';
import { setCurrentSong, userPlaySong, userSkipSong, userDislikeSong } from '../../../actions/songs';
import '../../../style.css'
import { rateSong } from '../../../external/saveSong';

const MoodPlayer = ({
    currentMoodPlaylist,
    match,
    history,
    currentSong,
    setCurrentSong,
    userPlaySong,
    userSkipSong,
    userDislikeSong,
}) => {
    
    let playerStyle = {
        zIndex: 1400,
        transition: "all .3s ease",
        height: " calc(100vh - 30px)",
        justifyContent: "space-evenly",
    };

    const { mood } = match.params;
    const audioPlayer = useRef();
    const [audioState, setAudioState] = useState("loading");
    const [volumeLevel, setVolumeLevel] = useState(1);
    if (!currentSong) {
        history.push(`/mood/${mood}`);
    }

    const playNext = () => {
        const currentIndex = currentMoodPlaylist.findIndex(
            (song) => song.songId === currentSong.songId
        );
        const song = currentMoodPlaylist[currentIndex + 1 === currentMoodPlaylist.length ? 0 : currentIndex + 1]; //we will play the next song
        setCurrentSong(song);
    };

    const playPrevious = () => {
        const currentIndex = currentMoodPlaylist.findIndex(
            (song) => song.songId === currentSong.songId
        );
        if (currentIndex !== -1) {
            const song = currentMoodPlaylist[currentIndex - 1 === -1 ? currentMoodPlaylist.length - 1 : currentIndex - 1]; //we will play the previous
            setCurrentSong(song);
        }
    };


    const handleSkipSong = () => {
        userSkipSong(
            mood,
            currentSong.songId,
            currentSong.title,
            currentSong.channelTitle,
            currentSong.thumbnail
        );
        playNext();
        userDislikeSong(currentSong.songId, mood);
        rateSong(currentSong.songId, 'disliked');
    }

    const songEnded = () => {
        playNext();
    };

    const handleSongReady = () => {
        setAudioState('playing');
        userPlaySong(
            mood,
            currentSong.songId,
            currentSong.title,
            currentSong.channelTitle,
            currentSong.thumbnail,
        );
    }

    return (
        <div className={"mediaPlayerContainer"}>
            <Grid
                container
                direction="column"
                className="main-player-inner"
                style={playerStyle}
            >
                <TopBar
                    song={currentSong}
                    history={history}
                    volumeController={setVolumeLevel}
                />
                <ReactPlayer
                    onReady={handleSongReady}
                    onBufferEnd={() => setAudioState("playing")}
                    ref={audioPlayer}
                    onEnded={songEnded}
                    volume={volumeLevel}
                    onPause={() => setAudioState('paused')}
                    playing={audioState === "playing" ? true : false}
                    url={`https://www.youtube.com/watch?v=${currentSong.songId}`}
                    style={{ margin: "auto", marginTop: "5rem" }}
                />
                <TimelineController audioState={audioState} player={audioPlayer} />

                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                    style={{ maxWidth: "350px", height: "80px", margin: "0 auto" }}
                >
                    <PreviousButton playPrevious={playPrevious} />
                    <PlayPauseButton changeAudioState={setAudioState} audioState={audioState} />
                    <NextButton onPlayNext={playNext} />
                    <IconButton style={{ color: "#fff" }} aria-label="Next" onClick={handleSkipSong}>
                        <ThumbDown style={{ color: "#fff" }} />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    );
};

const mapper = (state) => ({
    currentMoodPlaylist: state.song.currentMoodPlaylist,
    currentSong: state.song.currentSong,
});

export default connect(mapper, { setCurrentSong, userPlaySong, userSkipSong, userDislikeSong })(MoodPlayer);
