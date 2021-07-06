import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { connect } from "react-redux";

import { userPlaySong, userSkipSong, playlistCreated, playlistUpdated } from "../../../actions/songs";

import youtubeSearch from "../../../apis/youtubeSearch";
import { emoAlgorithm } from "../../../utils/emoAlgorithm";
import ListItem from "./ListItem";

const MoodPlaylist = ({ areUserSongsLoading, songsArray, currentMoodPlaylist, match, playlistCreated, playlistUpdated }) => {

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
  if (songsArray[mood]?.length) {

    return (
      <div style={{ minHeight: '100vh' }}>
        {currentMoodPlaylist.map((song, index) => (
          <ListItem key={index} song={song} />
        ))}
      </div>
    );
  }
  return null;
}


const mapper = (state) => ({
  songsArray: state.song.songsArray,
  currentMoodPlaylist: state.song.currentMoodPlaylist,
  areUserSongsLoading: state.song.isLoading,
});

export default connect(mapper, { userPlaySong, userSkipSong, playlistCreated, playlistUpdated })(MoodPlaylist);
