import {
  Avatar,
  Divider,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { setCurrentSong } from "../../../actions/songs";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const ListItem = ({song, mood, history, setCurrentSong}) => {
  
  const handleClick = () => {
    setCurrentSong(song);
    history.push(`/${mood}/${song.songId}`)
  }
  return (
    <div onClick={handleClick}>
      <div style={{ display: 'flex', alignItems: 'center', color: '#fff', padding: '1rem', justifyContent:'center'}}>
        <ListItemAvatar>
          <Avatar
            className="searchThumb"
            style={{ width: "60px", height: "60px", marginRight: "15px" }}
            alt={song?.title}
            src={song?.thumbnail || song?.thumbnails?.high?.url}
          />
        </ListItemAvatar>
        <ListItemText
          primary={entities.decode(song?.title, { level: "xml" })}
          secondary={
            <>
              <span style={{ color: "#fff" }}>
                {song?.channelTitle}
              </span>
            </>
          }
        />
      </div>
      <Divider style={{background:'#fff'}} />
    </div>
  );
};

export default connect(null, {setCurrentSong})(withRouter(ListItem));
