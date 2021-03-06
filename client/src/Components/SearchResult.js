import React, { useContext } from "react";
import { motion, useCycle } from "framer-motion";

import { GlobalContext } from "./GlobalState";

import "../style.css";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  ListItemText,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

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

const ulVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const SearchResult = ({ videos }) => {
  const [isOpen, setisOpen] = useCycle(false, true);
  const history = useHistory();
  const [, dispatch] = useContext(GlobalContext);
  const setCurrentVideoSnippet = (data) => {
    dispatch({ type: "setCurrentVideoSnippet", snippet: data });
  };

  const handleClick = (video) => {
    // set all the info of current clicked video in this object
    setCurrentVideoSnippet({
      id: video.id.videoId,
      title: entities.decode(video.snippet.title, { level: "xml" }),
      channelTitle: entities.decode(video.snippet.channelTitle, {
        level: "xml",
      }),
      maxThumbnail: `https://img.youtube.com/vi/${video.id.videoId}/maxresdefault.jpg`,
      sdThumbnail: `https://img.youtube.com/vi/${video.id.videoId}/sddefault.jpg`,
      // this is the url of the max resolution of thumbnail
    });
    history.push(`/play/${video?.id?.videoId}`)
  };

  React.useEffect(() => {
    setisOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderResult = videos.map((video) => {
    const { snippet } = video;
    return (
      <motion.div variants={liVariants} key={video.id.videoId}>
        <ListItem
          alignItems="flex-start"
          button
          onClick={() => handleClick(video)}
          style={{ color: "#fff" }}
        >
          <ListItemAvatar>
            <Avatar
              className="searchThumb"
              style={{ width: "60px", height: "60px", marginRight: "15px" }}
              alt={snippet.title}
              src={snippet.thumbnails.high.url}
            />
          </ListItemAvatar>
          <ListItemText
            primary={entities.decode(snippet.title, { level: "xml" })}
            secondary={
              <>
                <span style={{ color: "#fff" }}>{snippet.channelTitle}</span>
              </>
            }
          />
        </ListItem>
        <Divider />
      </motion.div>
    );
  });

  return (
    <motion.div
      variants={ulVariants}
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      {renderResult}
    </motion.div>
  );
};

export default SearchResult;
