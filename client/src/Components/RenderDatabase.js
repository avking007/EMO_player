import React, { useContext, useState, useEffect } from 'react';

import { DynamicSizeList as List } from 'react-window-dynamic';

import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  ListItemText,
} from '@material-ui/core';


import { GlobalContext } from './GlobalState';
import { deleteSongAudio } from '../external/saveSong';
import { useHistory } from 'react-router-dom';

let currentId;

export const useSongMethods = (songId) => {
  const [, dispatch] = useContext(GlobalContext);

  const setSnackbarMsg = React.useCallback(
    (data) => {
      dispatch({ type: 'setSnackbarMsg', snippet: data });
    },
    [dispatch]
  );

  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [dontAskPopup, setDontAskPopup] = useState(null);

  useEffect(() => {
    //convert string to bool
    const popupLocalState = localStorage.getItem('dontAskPopup') === 'true';
    setDontAskPopup(popupLocalState);
    // for popup settings
  }, []);

  const disablePopup = () => {
    localStorage.setItem('dontAskPopup', true);
    setDontAskPopup(true);
  };

  const deleteTheSong = async (checkBox) => {
    await deleteSongAudio(currentId);
    setDeleteDialogState(false);
    setSnackbarMsg('Deleted Successfully');

    // console.log(currentId, checkBox);
    // we will set it to localstorage the popup option
    if (checkBox) {
      disablePopup();
    }
  };

  // hadnling download dialog
  const handleRemoveSong = (songId) => {
    // console.log("handle remove dude");
    currentId = songId;
    // when user clicks on the download badge we will check the state
    // then delete the song without showing the popup if dontAskPopup is true
    // and delete the song by calling deleteTheSong
    dontAskPopup ? deleteTheSong() : setDeleteDialogState(true);
  };

  return {
    handleRemoveSong,
    deleteTheSong,
    dontAskPopup,
    setDeleteDialogState,
    deleteDialogState,
  };
};

const RenderDatabase = (props) => {
  const songs = props.songs;
  const [, dispatch] = useContext(GlobalContext);
  const setCurrentVideoSnippet = (data) => {
    dispatch({ type: 'setCurrentVideoSnippet', snippet: data });
  };

  const history = useHistory();
  const handleClick = (song) => {
    // set all the info of current clicked video in this object
    setCurrentVideoSnippet({
      id: song.videoId,
      audio: song.audio,
      thumbnail: song.thumbnail,
      title: song.title,
      channelTitle: song.channelTitle,
      maxThumbnail: `https://img.youtube.com/vi/${song.videoId}/maxresdefault.jpg`,
      sdThumbnail: `https://img.youtube.com/vi/${song.videoId}/sddefault.jpg`,
      // this is the url of the max resolution of thumbnail
    });
  
    history.push(`/play/${song?.videoId}`);
  };

  const {
    deleteDialogComponent,
  } = useSongMethods();

  const renderResult = songs.map((song) => {
    console.log(songs);
    return (
      <>
        <ListItem
          alignItems="flex-start"
          button
          onClick={() => handleClick(song)}
        >
          <ListItemAvatar>
            <Avatar
              className="searchThumb"
              style={{ width: '60px', height: '60px', marginRight: '15px' }}
              alt={song.title}
              src={`https://img.youtube.com/vi/${song.videoId}/default.jpg`}
            />
          </ListItemAvatar>
          {/* we will play the song when clicked on title */}
          <ListItemText
            primary={song.title}
            secondary={
              <React.Fragment>
                <span style={{color: '#fff'}}>
                  {song.channelTitle}
                </span>
              </React.Fragment>
            }
          />
        </ListItem>
      </>
    );
  });

  const renderItem = React.forwardRef((row, ref) => (
    <div
      ref={ref}
      style={{
        ...row.style,
        maxWidth: '1000px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#fff'
      }}
    >
      {renderResult[row.index]}
      <Divider />
    </div>
  ));
  return (
    <>
      {deleteDialogComponent}

      <List
        height={window.innerHeight - 100}
        itemCount={songs.length}
      >
        {renderItem}
      </List>
    </>
  );
};

export default RenderDatabase;
