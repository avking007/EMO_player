import { CircularProgress, Grid } from "@material-ui/core";
import { motion, useCycle } from "framer-motion";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { userPlaySong, userSkipSong } from "../../../actions/songs";
import youtubeSearch from "../../../apis/youtubeSearch";
import { emoAlgorithm } from "../../../utils/emoAlgorithm";
import FetchPlaylist from "./FetchPlaylist";
import ListItem from "./ListItem";

const ulVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

// ComponentDidMount
const MoodPlaylist = ({ songsArray, userPlaySong, userSkipSong, match }) => {
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setisOpen] = useCycle(false, true);

  const { mood } = match.params;

  const CircularLoader = (
    <Grid
      style={{ height: "109vh" }}
      container
      justify="center"
      alignItems="center"
    >
      <CircularProgress />
    </Grid>
  );

  useEffect(() => {
    const searchYt = async (data) => {
      const res = await youtubeSearch.get("/search", {
        params: {
          q: data,
          maxResults: 15 - songsArray.mood.length,
        },
      });
      setSearchResult(res.data.items);
      setIsLoading(false);
    };

    if (songsArray.mood.length < 15) {
      searchYt(`${mood} songs`);
    }
  }, [mood, songsArray]);
  useEffect(() => {
    const newPlayList = emoAlgorithm(songsArray);
    setSearchResult([...newPlayList]);
  }, [songsArray]);

  useEffect(() => {
    setisOpen(true);
  }, [setisOpen]);

  const getCustomPlaylist = (songs) => {
    const newPlaylist = emoAlgorithm(songs);
    return (
      <motion.div
        variants={ulVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        {newPlaylist.map((song, index) => {
          return <ListItem key={index} song={song} />;
        })}
      </motion.div>
    );
  };
  return isLoading ? (
    <CircularLoader />
  ) : (
    <div>
      {songsArray.mood.length && getCustomPlaylist(songsArray.mood)}

      <FetchPlaylist videos={searchResult} />
    </div>
  );
};

const mapper = (state) => ({
  songsArray: state.songs,
});

export default connect(mapper, { userPlaySong, userSkipSong })(
  withRouter(MoodPlaylist)
);
