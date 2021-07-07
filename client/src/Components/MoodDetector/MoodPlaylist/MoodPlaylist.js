import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { connect } from "react-redux";

import { userPlaySong, userSkipSong, playlistCreated, playlistUpdated } from "../../../actions/songs";

import youtubeSearch from "../../../apis/youtubeSearch";
import { emoAlgorithm } from "../../../utils/emoAlgorithm";
import MoodPlayer from '../MoodPlayer/MoodPlayer';
import ListItem from "./ListItem";

const MoodPlaylist = ({ currentSong, areUserSongsLoading, songsArray, currentMoodPlaylist, match, playlistCreated, playlistUpdated }) => {

  const { mood } = match.params;

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


  if (areUserSongsLoading) return CircularLoader();
  if (currentMoodPlaylist?.length) {

    return (
      <div style={{ minHeight: '100vh' }}>
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

export default connect(mapper, { userPlaySong, userSkipSong, playlistCreated, playlistUpdated })(MoodPlaylist);
