import React, { useEffect, useContext, useState, useRef } from "react";
import { connect } from 'react-redux';
import { Grid } from "@material-ui/core";
import { useSwipeable } from "react-swipeable";

import { GlobalContext } from "../GlobalState";
import getAudioLink from "../../apis/getAudioLink";
import youtubeSearch from "../../apis/youtubeSearch";
import { updatePlayingSong } from "../../external/saveSong";
import { userPlaySong } from "../../actions/songs";
import "../../external/saveCountry";

import PlayPauseButton from "./PlayPauseButton";
import NextButton from "./NextButton";
import PreviousButton from "./PreviousButton";
import MusicArt from "./MusicArt";
import TimelineController from "./TimelineController";
import TopBar from "./TopBar";
import MiniMusicArt from "./MiniMusicArt";
import RelatedVideos from "../RelatedVideos";

import "../../style.css";

let relatedVideosVar;

const MainPlayer = ({ location, history, userPlaySong }) => {
  let params = new URLSearchParams(location.search);

  const mood = params.get('mood');
  const [{ currentVideoSnippet, themeSelectValue }, dispatch] = useContext(
    GlobalContext
  );

  const setCurrentVideoSnippet = (data) => {
    dispatch({ type: "setCurrentVideoSnippet", snippet: data });
  };

  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isItFromPlaylist, setIsItFromPlaylist] = useState(false);
  const [audioState, setAudioState] = useState(null);
  // there will be 4 states
  // loading, loaded, playing, paused

  const [playerState, setPlayerState] = useState(null);
  // there will be 3 states
  // maximized, minimized, playlist

  const [minimized, setMinimized] = useState(true);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [rating, setRating] = useState("none");
  const [isNextFromMini, setIsNextFromMini] = useState(false);
  const body = document.querySelector("body");

  const audioPlayer = useRef();
  const player = audioPlayer.current;
  const setupMediaSessions = () => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentVideoSnippet.title,
        artist: currentVideoSnippet.channelTitle,
        artwork: [
          {
            src: currentVideoSnippet.sdThumbnail,
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

  useEffect(() => {
    const getAudio = async (data) => {
      // maximize the player every time id changes
      // only if playlist is not open
      if (playerState !== "playlist" && !isNextFromMini) {
        setPlayerState("maximized");
      }

      setTimeout(() => {
        setIsNextFromMini(false);
        // change it back to false
      }, 200);

      setAudioState("loading");
      const res = await getAudioLink.get("/song", {
        params: { id: data },
      });

      // set the audio data
      audioPlayer.current.src = res.data;
      playAudio();
    };

    if (currentVideoSnippet.audio) {
      // maximize the player every time id changes

      setPlayerState("maximized");
      setAudioState("loading");
      audioPlayer.current.src = window.URL.createObjectURL(
        currentVideoSnippet.audio
      );
      playAudio();
    } else if (currentVideoSnippet.id) {
      getAudio(currentVideoSnippet.id);
    }

    if (currentVideoSnippet.id) {
      const searchRelated = async () => {
        const res = await youtubeSearch.get("/search", {
          params: {
            relatedToVideoId: currentVideoSnippet.id,
            maxResults: 10,
          },
        });
        setRelatedVideos(res.data.items);
      };

      // if its not from the mini next button then only change history
      if (!isNextFromMini) {
        // if the click is not from playlist then only we will search for realated video
        if (!isItFromPlaylist) {
          // if player is in playlist mode we will just replace history else push it
          if (location.pathname !== "/play") {
            // prevent duplicating history
            history.push(`/play?id=${currentVideoSnippet.id}`);
          }

          searchRelated();
        } else {
          history.replace(`/play?id=${currentVideoSnippet.id}`);
          setIsItFromPlaylist(false);
        }
      }
    }

    // set rating to none when we load new song
    setRating("none");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoSnippet, setIsItFromPlaylist]);

  useEffect(() => {
    relatedVideosVar = relatedVideos;
  }, [relatedVideos]);

  const setAudioSrcAndPlay = async (id) => {
    const res = await getAudioLink.get("/song", {
      params: { id: id },
    });

    // set the audio data
    audioPlayer.current.src = res.data;
    playAudio();
  };

  const setVideoSnippet = (video) => {
    setCurrentVideoSnippet({
      id: video.id.videoId,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      maxThumbnail: `https://img.youtube.com/vi/${video.id.videoId}/hqdefault.jpg`,
      sdThumbnail: `https://img.youtube.com/vi/${video.id.videoId}/sddefault.jpg`,
      // this is the url of the max resolution of thumbnail
    });

    // if window is minimized then only we will run this function
    if (document.hidden) {
      setAudioSrcAndPlay(video.id.videoId);
    }
  };

  const playNext = () => {
    // also set this is from playlist
    setIsItFromPlaylist(true);
    const currentIndex = relatedVideosVar.findIndex(
      (video) => video.id.videoId === currentVideoSnippet.id
    );
    let video;
    video = relatedVideosVar[currentIndex + 1]; //we will play the next song

    setVideoSnippet(video);
  };

  const playPrevious = () => {
    setIsItFromPlaylist(true);

    // if the player time is greater than 5 sec we will move the time to 0
    if (player.currentTime > 5) {
      player.currentTime = 0;
    } else {
      const currentIndex = relatedVideosVar.findIndex(
        (video) => video.id.videoId === currentVideoSnippet.id
      );
      let video;
      if (currentIndex !== -1) {
        video = relatedVideosVar[currentIndex - 1]; //we will play the next song
        setVideoSnippet(video);
      } else {
        player.currentTime = 0;
      }
    }
  };

  let playerStyle = {
    zIndex: 1400,
    transition: "all .3s ease",
  };

  if (playerState === "minimized") {
    playerStyle.transform = "translateY(calc(100% - 106px))";
    playerStyle.zIndex = 0;
    // if theme is not dark then only apply the pink style
    if (themeSelectValue === "Dark") {
      playerStyle.background = "#333";
    } else {
      playerStyle.background = "#e91e63";
    }
    body.style.overflow = "auto";
  }

  if (playerState === "maximized") {
    // make body overflow hidden 🙈
    body.style.overflow = "hidden";
    if (themeSelectValue === "Dark") {
      playerStyle.background = "#333";
    }
  }

  if (playerState === "playlist") {
    playerStyle.transform = "translateY(-418px)";
  }

  const expandPlayer = () => {
    if (playerState === "minimized") {
      setPlayerState("maximized");
      setMinimized(true);
      history.push({
        pathname: "/play",
        search: `?id=${currentVideoSnippet.id}`,
        state: { modal: true },
      });
    }
  };

  const toggleMaxPlaylist = () => {
    if (playerState === "playlist") {
      setPlayerState("maximized");
    } else {
      setPlayerState("playlist");
    }
    // console.log("Maximize the playlist");
  };

  const updateSongDB = async () => {
    const rating = await updatePlayingSong(currentVideoSnippet).then(()=> {
      userPlaySong(mood, params.get('id'));
    });
    //  it will update song on db and return the rating
    console.log(rating);
    setRating(rating);
  };

  // this will be fired when song is ended
  const songEnded = () => {
    // if repeat is false we will play next else just set the time to 0
    if (!isRepeatOn) {
      playNext();
    } else {
      audioPlayer.current.currentTime = 0;
      playAudio();
    }
  };

  let initPosition = 0;
  const containerRef = useRef(null);

  const swipeHandlerMaximized = useSwipeable({
    onSwipedDown: (e) => {
      setPlayerState("minimized");
      history.goBack();
    },
    onSwiping: (e) => {
      // // console.log(e);
      // getting the event for touches to extract the position
      if (initPosition === 0) {
        initPosition = e.event.changedTouches[0].screenY;
      }

      const screenY = e.event.changedTouches[0].screenY;
      let positionDifference = Math.round(screenY - initPosition);
      if (positionDifference < 1) {
        positionDifference = 0;
      }

      const containerRefStyle = containerRef.current.style;
      containerRefStyle.transform = `translateY(${positionDifference}px)`;
      containerRefStyle.transition = "none";
    },
    onSwiped: (e) => {
      initPosition = 0;
      containerRef.current.style = "";
      // we will make the initial position 0 again after user leaves the screen
    },
    onSwipedUp: (e) => {
      if (playerState === "minimized") {
        setPlayerState("maximized");
      }
    },
    onSwipedRight: (e) => {
      const playTimeout = setTimeout(() => {
        clearTimeout(playTimeout);
        playNext();
      }, 250);
    },
    onSwipedLeft: (e) => {
      const playTimeout = setTimeout(() => {
        clearTimeout(playTimeout);
        playPrevious();
      }, 250);
    },
  });

  const swipeHandlerMin = useSwipeable({
    onSwipedUp: (e) => {
      expandPlayer();
    },
  });

  useEffect(() => {
    if (location.pathname === "/play" && !currentVideoSnippet.id) {
      fetchAndSetCurrentVideoSnippet(params.get("id")); // math will give the song id from
    }
    // we will only change if its push  otherwise while changing song from playlist changes the state
    // Listen for changes to the current location.
    history.listen((location) => {
      // location is an object like window.location
      if (location.pathname === "/play") {
        // we will only change if its push  otherwise while changing song from playlist changes the state
        if (history.action !== "REPLACE") {
          setPlayerState("maximized");
        }
      } else {
        setPlayerState("minimized");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const returnMinMaxClass = () => {
    if (playerState === "minimized") {
      return "playerMinimized";
    } else if (playerState === "playlist") {
      return "playerPlaylist";
    }
  };

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
              player={player}
              setPlayerState={setPlayerState}
              history={history}
            />
            <div {...swipeHandlerMaximized} className="musicArtContainer">
              <MusicArt
                data={currentVideoSnippet}
                rating={rating}
                audioEl={player}
                mood={mood}
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
            </Grid>
          </Grid>
          <RelatedVideos
            toggleMaxPlaylist={toggleMaxPlaylist}
            setPlaylist={() => setIsItFromPlaylist(true)}
            playerState={playerState}
            relatedVideos={relatedVideos}
            setRelatedVideos={(data) => setRelatedVideos(data)}
            isRepeatOn={isRepeatOn}
            // this will set the repeat setting
            setIsRepeatOn={() => {
              setIsRepeatOn(!isRepeatOn);
            }}
          />
        </>
      );
    }
  };

  const returnMinimizedPlayer = () => {
    if (playerState === "minimized" && currentVideoSnippet.id) {
      return (
        <div {...swipeHandlerMin}>
          <MiniMusicArt
            // we are making an object for props we will pass it to play pause button through mini music art
            playPause={{
              player: player,
              minimized: minimized,
              audioState: audioState,
            }}
            playNext={(e) => {
              e.stopPropagation();
              setIsNextFromMini(true);
              playNext();
            }}
            data={currentVideoSnippet}
            emptyPlayer={(e) => {
              e.stopPropagation();
              setCurrentVideoSnippet([]);
            }}
          />
          <TimelineController
            audioState={audioState}
            player={player}
            minimized={minimized}
          />
        </div>
      );
    }
  };

  const fetchAndSetCurrentVideoSnippet = async (id) => {
    try {
      const res = await youtubeSearch.get("videos", { params: { id: id, } })
      const item = res.data.items[0];

      setCurrentVideoSnippet({
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        maxThumbnail: `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`,
        sdThumbnail: `https://img.youtube.com/vi/${item.id}/sddefault.jpg`,
      
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentVideoSnippet.id) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      onClick={expandPlayer}
      className={"mediaPlayerContainer " + returnMinMaxClass()}
    >
      {returnMaximizedPlayer()}
      {returnMinimizedPlayer()}
      <audio
        onLoadStart={() => {
          setAudioState("loading");
        }}
        id="audio-element"
        onLoadedData={updateSongDB}
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

export default connect(null, {userPlaySong} )(MainPlayer);
