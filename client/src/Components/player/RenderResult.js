import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React from "react";



const RenderResult = ({ videos }) => {
    const SearchResult = ({ videos }) => {
        const [isOpen, setisOpen] = useCycle(false, true);
      
        const [, dispatch] = useContext(GlobalContext);
        const setCurrentVideoSnippet = (data) => {
          dispatch({ type: 'setCurrentVideoSnippet', snippet: data });
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
    };
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
  return renderResult;
};

export default RenderResult;
