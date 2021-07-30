import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IconButton } from "@material-ui/core/";
import { userPlaySong, userSkipSong, playlistCreated, playlistUpdated, newPlaylistCreated } from "../../../actions/songs";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import youtubeSearch from "../../../apis/youtubeSearch";
import { emoAlgorithm } from "../../../utils/emoAlgorithm";
import MoodPlayer from '../MoodPlayer/MoodPlayer';
import ListItem from "./ListItem";

const MoodPlaylist = ({
  currentSong,
  areUserSongsLoading,
  songsArray,
  currentMoodPlaylist,
  match,
  playlistCreated,
  playlistUpdated,
  newPlaylistCreated
}) => {

  const { mood } = match.params;
  const [nextPageToken, setNextPageToken] = useState("");

  const CircularLoader = () => (
    <Grid
      style={{ height: "15vh" }}
      container
      justify="center"
      alignItems="center"
    >
      <CircularProgress />
    </Grid>
  );

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const res = await youtubeSearch.get("/search", {
          params: {
            q: `${mood} songs`,
            maxResults: 15 - songsArray[mood].length,
          },
        });

        playlistUpdated(res.data.items);
      } catch (error) {
        console.log(error);
      }
    };

    const getCustomPlaylist = (songs) => {
      const newPlaylist = emoAlgorithm(songs);
      playlistCreated(newPlaylist);
    };
    if (songsArray[mood]?.length > 0) getCustomPlaylist(songsArray[mood]);
    if (!areUserSongsLoading && songsArray[mood]?.length < 15) getSearchResults();
  }, [songsArray, mood, playlistCreated, playlistUpdated, areUserSongsLoading])

  const loadNewPlaylist = async () => {
    try {
      const res = await youtubeSearch.get("/search", {
        params: {
          q: `${mood} songs`,
          maxResults: 15,
          pageToken: nextPageToken
        }
      });

      setNextPageToken(res.data.nextPageToken);
      newPlaylistCreated(res.data.items);
    } catch (error) {
      console.log(error);
    }
  }

  if (areUserSongsLoading) return CircularLoader();
  if (currentMoodPlaylist?.length) {

    return (
      <div style={{ minHeight: '100vh' }}>
        <div style={{color: 'white', padding: '1rem', background: 'rgb(29, 185, 84)'}}>{`Looks like your mood is ${mood}. Here are some ${mood} mood songs.`}</div>
        <span style={{ paddingLeft: '15px', color: '#fff', margin: "auto" }}>Load new playlist</span>
        <IconButton onClick={loadNewPlaylist} style={{ color: '#fff' }}>
          <AutorenewIcon />
        </IconButton>
        {currentMoodPlaylist.map((song, index) => (
          <ListItem key={index} song={song} mood={mood} />
        ))}
      </div>
    );
  }
  if (currentSong) return <MoodPlayer />
  return (<div style={{ height: '100vh' }} />);
}


const mapper = (state) => ({
  songsArray: state.song.songsArray,
  currentMoodPlaylist: state.song.currentMoodPlaylist,
  areUserSongsLoading: state.song.isLoading,
  currentSong: state.song.currentSong
});

export default connect(mapper, { userPlaySong, userSkipSong, playlistCreated, playlistUpdated, newPlaylistCreated })(MoodPlaylist);
