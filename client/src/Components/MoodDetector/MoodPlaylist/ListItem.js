import {
  Avatar,
  CircularProgress,
  Divider,
  Grid,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useEffect } from "react";
import youtubeSearch from "../../../apis/youtubeSearch";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const ListItem = ({ song }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoSnippet, setCurrentVideoSnippet] = useState({});
  const liVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };
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
  const fetchAndSetCurrentVideoSnippet = async (id) => {
    try {
      const res = await youtubeSearch.get("videos", { params: { id: id } });
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetCurrentVideoSnippet(song.songId);
  }, [song.songId]);

  return isLoading ? (
    <CircularLoader />
  ) : (
    <motion.div variants={liVariants} key={song.songId}>
      <ListItem
        alignItems="flex-start"
        button
        onClick={() => {}}
        style={{ color: "#fff" }}
      >
        <ListItemAvatar>
          <Avatar
            className="searchThumb"
            style={{ width: "60px", height: "60px", marginRight: "15px" }}
            alt={currentVideoSnippet.title}
            src={currentVideoSnippet.thumbnails.high.url}
          />
        </ListItemAvatar>
        <ListItemText
          primary={entities.decode(currentVideoSnippet.title, { level: "xml" })}
          secondary={
            <>
              <span style={{ color: "#fff" }}>
                {currentVideoSnippet.channelTitle}
              </span>
            </>
          }
        />
      </ListItem>
      <Divider />
    </motion.div>
  );
};

export default ListItem;
