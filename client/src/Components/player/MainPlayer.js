import React, { useEffect, useContext, useState, useRef } from "react";
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core/";
import { ThumbDown } from "@material-ui/icons/";

import { GlobalContext } from "../GlobalState";
import youtubeSearch from "../../apis/youtubeSearch";
import { userPlaySong, userSkipSong } from "../../actions/songs";
import "../../external/saveCountry";

import PlayPauseButton from "./PlayPauseButton";
import NextButton from "./NextButton";
import PreviousButton from "./PreviousButton";
import TimelineController from "./TimelineController";
import TopBar from "./TopBar";
import RelatedVideos from "../RelatedVideos";

import "../../style.css";

const MainPlayer = ({ history, userPlaySong, userSkipSong }) => {


  const [{ currentVideoSnippet }, dispatch] = useContext(
    GlobalContext
  );

  const setCurrentVideoSnippet = (data) => {
    dispatch({ type: "setCurrentVideoSnippet", snippet: data });
  };

  const [volumeLevel, setVolumeLevel] = useState(1);
  const [isItFromPlaylist, setIsItFromPlaylist] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  // there will be 4 states
  // loading, loaded, playing, paused
  const [audioState, setAudioState] = useState(null);

  // there will be 3 states
  // maximized, minimized, playlist
  const [playerState, setPlayerState] = useState(null);

  const audioPlayer = useRef();
  const player = audioPlayer?.current;

  useEffect(() => {
    setPlayerState("maximized");

    if (currentVideoSnippet.id) {
      const searchRelated = async () => {
        try {
          const res = await youtubeSearch.get("/search", {
            params: {
              relatedToVideoId: currentVideoSnippet.id,
              maxResults: 10,
            },
          });
          const _res  = res.data.items.filter((song) => song.snippet !== (null || undefined))
          setRelatedVideos(_res);
        } catch (error) {
          alert("Could not load a song because you have exhausted your quota!!! ");
          history.push('/home');
        }
      };

      if (isItFromPlaylist) {
        setIsItFromPlaylist(false);
      } else {
        searchRelated();
      }
      history.push(`/play/${currentVideoSnippet.id}`);
    }
    setAudioState('playing');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoSnippet]);


  const setVideoSnippet = (video) => {

    try {
      setCurrentVideoSnippet({
        id: video?.id.videoId || video.id,
        title: video.snippet?.title || video.title,
        channelTitle: video.snippet?.channelTitle || video.channelTitle,
        maxThumbnail: `https://img.youtube.com/vi/${video.id.videoId || video.id}/hqdefault.jpg`,
        sdThumbnail: `https://img.youtube.com/vi/${video.id.videoId || video.id}/sddefault.jpg`,
      });

    } catch (error) {
      alert("Could not load a song because you have exhausted your quota!!! ");
      history.push('/home');
    }
  };

  const playNext = () => {
    setIsItFromPlaylist(true);
    const currentIndex = relatedVideos.findIndex(
      (video) => video.id.videoId === currentVideoSnippet.id);
    if (currentIndex !== -1) {
      const video = relatedVideos[currentIndex + 1 === relatedVideos.length ? 0 : currentIndex + 1]; //we will play the next song
      setVideoSnippet(video);
    } else {
      const video = relatedVideos[0];
      setVideoSnippet(video);
    }
    player?.seekTo(0);
  };

  const playPrevious = () => {
    setIsItFromPlaylist(true);
    const currentIndex = relatedVideos.findIndex(
      (video) => video.id.videoId === currentVideoSnippet.id
    );
    if (currentIndex !== -1) {
      const video = relatedVideos[currentIndex - 1 === -1 ? relatedVideos.length - 1 : currentIndex - 1]; //we will play the next song
      setVideoSnippet(video);
    } else {
      const video = relatedVideos[0];
      setVideoSnippet(video);
    }
    player?.seekTo(0);
  }

  let playerStyle = {
    zIndex: 1400,
    transition: "all .3s ease",
  };

  if (playerState === "minimized") {
    playerStyle.transform = "translateY(calc(100% - 106px))";
    playerStyle.zIndex = 0;
    playerStyle.display = "none";
    playerStyle.background = "#333";
  }
  
  if (playerState === "playlist") {
    playerStyle.transform = "translateY(-418px)";
  }

  const toggleMaxPlaylist = () => {
    if (playerState === "playlist") {
      setPlayerState("maximized");
    } else {
      setPlayerState("playlist");
    }
  };

  // this will be fired when song is ended
  const songEnded = () => {
    // if repeat is false we will play next else just set the time to 0
    playNext();
  };

  const handleSongReady = () => {
    setAudioState('playing');
    if (currentVideoSnippet?.id) {
      userPlaySong(
        'neutral',
        currentVideoSnippet.id,
        currentVideoSnippet.title,
        currentVideoSnippet.channelTitle,
        currentVideoSnippet.maxThumbnail,
      );
    }
  }
  const handleSkipSong = () => {
    userSkipSong(
      "neutral",
      currentVideoSnippet.id,
      currentVideoSnippet.title,
      currentVideoSnippet.channelTitle,
      currentVideoSnippet.maxThumbnail
    );
    playNext();
  }

  const returnMaximizedPlayer = () => {
    if (playerState === "maximized" || playerState === "playlist") {
      return (
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
              song={currentVideoSnippet}
              volumeController={setVolumeLevel}
              setPlayerState={setPlayerState}
              history={history}
            />
            <ReactPlayer
              onReady={handleSongReady}
              onBufferEnd={() => setAudioState("playing")}
              ref={audioPlayer}
              onEnded={songEnded}
              volume={volumeLevel}
              onPause={() => setAudioState('paused')}
              playing={audioState === "playing" ? true : false}
              url={`https://www.youtube.com/watch?v=${currentVideoSnippet?.id}`}
              style={{ margin: "auto", marginTop: "3rem", marginBottom: '0' }}
            />
            <TimelineController audioState={audioState} player={audioPlayer} />
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
              style={{ maxWidth: "290px", height: "80px", margin: "0 auto" }}
            >
              <PreviousButton playPrevious={playPrevious} />
              <PlayPauseButton changeAudioState={setAudioState} audioState={audioState} />
              <NextButton onPlayNext={playNext} />
              <IconButton style={{ color: "#fff" }} aria-label="Next" onClick={handleSkipSong}>
                <ThumbDown style={{ color: "#fff" }} />
              </IconButton>
            </Grid>
          </Grid>
          <RelatedVideos
            toggleMaxPlaylist={() => toggleMaxPlaylist()}
            playerState={playerState}
            setPlaylist={() => setIsItFromPlaylist(true)}
            relatedVideos={relatedVideos}
            setRelatedVideos={(data) => setRelatedVideos(data)}
          />
        </>
      );
    }
  };

  const returnMinMaxClass = () => {
    if (playerState === "minimized") return "playerMinimized";
    if (playerState === "playlist") return "playerPlaylist";
  }
  return (
    <div
      className={"mediaPlayerContainer " + returnMinMaxClass()}
    >
      {returnMaximizedPlayer()}

    </div>
  );
};

export default connect(null, { userPlaySong, userSkipSong })(MainPlayer);
