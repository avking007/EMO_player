import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { userPlaySong, userSkipSong } from "../../../actions/songs";
import youtubeSearch from "../../../apis/youtubeSearch";
import { emoAlgorithm } from "../../../utils/emoAlgorithm";
import FetchPlaylist from "./FetchPlaylist";
import ListItem from "./ListItem";

const MoodPlaylist = ({ areUserSongsLoading, songsArray, userPlaySong, userSkipSong, match }) => {
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { mood } = match.params;

  const CircularLoader = () => (
    <Grid
      style={{ height: "109vh" }}
      container
      justify="center"
      alignItems="center"
    >
      <CircularProgress />
    </Grid>
  );

  const getCustomPlaylist = (songs) => {
    const newPlaylist = emoAlgorithm(songs);

    return (
      <div
      // variants={ulVariants}
      // initial={false}
      // animate={isOpen ? "open" : "closed"}
      >
        {newPlaylist.map((song, index) => {
          return <ListItem key={index} song={song} />;
        })}
      </div>
    );
  };

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const res = await youtubeSearch.get("/search", {
          params: {
            q: `${mood} songs`,
            maxResults: 15 - songsArray[mood].length,
          },
        });
        setSearchResult(res.data.items);

      } catch (error) {
        console.log(error);
      }
    };
    if (songsArray[mood]?.length < 15) {
      getSearchResults();    
    }
  }, [songsArray, mood])
  
  useEffect(() => {
    if (searchResult.length > 0) {
      setIsLoading(false);
    }
  }, [searchResult])


  if (areUserSongsLoading) {
    return CircularLoader();
  } else if (songsArray[mood]?.length < 15) {
    return (
      // get mixed results
      <div style={{height:'fit-content'}}>
        {getCustomPlaylist(songsArray[mood])}
        {isLoading ? CircularLoader() : searchResult.map((song) => {
          const { snippet } = song;
          return <FetchPlaylist song={snippet} />
        })}
      </div>
    );

  } else if (songsArray[mood]?.length >= 15) {
    // get only user songs but EMO customized songs
    return getCustomPlaylist(songsArray[mood]);
  }
  return null;
}

const mapper = (state) => ({
  songsArray: state.song,
  areUserSongsLoaded: state.song.isLoading,
});

export default connect(mapper, { userPlaySong, userSkipSong })(MoodPlaylist);
