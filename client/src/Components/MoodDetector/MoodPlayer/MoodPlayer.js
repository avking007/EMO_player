import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core/";

import TopBar from '../../player/TopBar';
import MusicArt from '../../player/MusicArt';
import { ThumbDown } from "@material-ui/icons/";
import TimelineController from '../../player/TimelineController';
import PlayPauseButton from '../../player/PlayPauseButton';
import PreviousButton from '../../player/PreviousButton';
import NextButton from '../../player/NextButton';
import { setCurrentSong, userPlaySong, userSkipSong } from '../../../actions/songs';
import getAudioLink from '../../../apis/getAudioLink';
import '../../../style.css'

const MoodPlayer = ({ currentMoodPlaylist, match, history, currentSong, setCurrentSong, userPlaySong, userSkipSong }) => {
    let playerStyle = {
        zIndex: 1400,
        transition: "all .3s ease",
    };

    const { mood } = match.params;
    const containerRef = useRef(null);

    const body = document.querySelector("body");

    const [playerState, setPlayerState] = useState();
    const audioPlayer = useRef();
    const [audioState, setAudioState] = useState(null);
    const player = audioPlayer.current;
    if (!currentSong) {
        history.push(`/mood/${mood}`);
    }

    if (playerState === "minimized") {
        playerStyle.transform = "translateY(calc(100% - 106px))";
        playerStyle.zIndex = 0;
        // if theme is not dark then only apply the pink style
        playerStyle.background = "#333";
        playerStyle.background = "#e91e63"
        body.style.overflow = "auto";
    }

    const playNext = () => {
        const currentIndex = currentMoodPlaylist.findIndex(
            (song) => song.songId === currentSong.songId
        );
        const song = currentMoodPlaylist[currentIndex + 1 === currentMoodPlaylist.length ? 0 : currentIndex + 1]; //we will play the next song
        setCurrentSong(song);
    };

    const playPrevious = () => {

        // if the player time is greater than 5 sec we will move the time to 0
        if (player.currentTime > 5) {
            player.currentTime = 0;
        } else {
            const currentIndex = currentMoodPlaylist.findIndex(
                (song) => song.songId === currentSong.songId
            );
            let song;
            if (currentIndex !== -1) {
                song = currentMoodPlaylist[currentIndex - 1 === -1 ? currentMoodPlaylist.length - 1 : currentIndex - 1]; //we will play the previous
                setCurrentSong(song);

            } else {
                player.currentTime = 0;
            }
        }
    };

    const handleSkipSong = () => {
        userSkipSong(mood, currentSong.songId, currentSong.title, currentSong.channelTitle, currentSong.thumbnail);
    }
    const returnMaximizedPlayer = () => (playerState === "maximized") && (
        <>
            <Grid
                container
                direction="column"
                className="main-player-inner"
                style={{
                    height: " calc(100vh - 46px)",
                    justifyContent: "space-evenly",
                    ...playerStyle
                }}
            >
                <TopBar
                    song={currentSong}
                    player={player}
                    setPlayerState={setPlayerState}
                    history={history}
                />
                <div className="musicArtContainer">
                    <MusicArt
                        data={currentSong}
                        audioEl={player}
                    />
                </div>
                <TimelineController audioState={audioState} player={player} />

                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                    style={{ maxWidth: "290px", height: "80px", margin: "0 auto" }}
                >
                    <PreviousButton playPrevious={playPrevious} />
                    <PlayPauseButton player={player} audioState={audioState} />
                    <NextButton onPlayNext={playNext} />
                    <IconButton style={{ color: "#fff" }} aria-label="Next" onClick={handleSkipSong}>
                        <ThumbDown style={{ color: "#fff" }} />
                    </IconButton>
                </Grid>
            </Grid>
        </>
    );

    const setupMediaSessions = () => {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new window.MediaMetadata({
                title: currentSong.title,
                artist: currentSong.channelTitle,
                artwork: [
                    {
                        src: currentSong.thumbnail,
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            });
            navigator.mediaSession.setActionHandler("play", () => {
                /* Code excerpted. */
                playAudio();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                /* Code excerpted. */
                audioPlayer.current.pause();
            });
            navigator.mediaSession.setActionHandler("previoustrack", () => {
                playPrevious();
            });
            navigator.mediaSession.setActionHandler("nexttrack", () => {
                playNext();
            });
        }
    };

    const playAudio = () => {
        audioPlayer.current
            .play()
            .then((_) => {
                // Automatic playback started!
                // Show playing UI.
                setupMediaSessions();
            })
            .catch((error) => {
                // Auto-play was prevented
                // Show paused UI.
                setAudioState("paused");
            });
    };

    // this will be fired when song is ended
    const songEnded = () => {
        playNext();
    };

    const handleSongLoad = () => {
        userPlaySong(mood, currentSong.songId, currentSong.title, currentSong.channelTitle, currentSong.thumbnail);
    }

    useEffect(() => {
        const getAudio = async (data) => {
            setAudioState("loading");
            try {
                const res = await getAudioLink.get("/song", {
                    params: { id: data },
                });

                // set the audio data
                audioPlayer.current.src = res.data;
                playAudio();

            } catch (error) {
                console.log(error);
            }
        };

        setPlayerState("maximized");
        setAudioState("loading");
        if (currentSong?.songId) getAudio(currentSong.songId);
        else history.push('/home')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong]);

    return (
        <div
            ref={containerRef}
            className={"mediaPlayerContainer"}
        >
            {returnMaximizedPlayer()}
            <audio
                onLoadStart={() => {
                    setAudioState("loading");
                }}
                id="audio-element"
                onLoadedData={handleSongLoad}
                onPlay={() => setAudioState("playing")}
                onPlaying={() => setAudioState("playing")}
                onPause={() => setAudioState("paused")}
                onEnded={songEnded}
                autoPlay
                ref={audioPlayer}
            />
        </div>
    );
};

const mapper = (state) => ({
    currentMoodPlaylist: state.song.currentMoodPlaylist,
    currentSong: state.song.currentSong,
});

export default connect(mapper, { setCurrentSong, userPlaySong, userSkipSong })(MoodPlayer);
