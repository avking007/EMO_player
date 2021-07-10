import axios from 'axios';
import { CLEAR_USER_PLAYING_SONGS, PLAYLIST_CLEARED, PLAYLIST_CREATED, PLAYLIST_UPDATED, SONG_PLAYED, SONG_PLAYED_FAIL, SONG_SKIPPED, SONG_SKIPPED_FAIL, USER_SONG_PLAYED } from '../reducers/types';
import { API } from '../utils/backend';

export const userPlaySong = (mood, songId, title, channelTitle, thumbnail) => async (dispatch) => {
    try {
        const body = JSON.stringify({ title, channelTitle, thumbnail })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put(`${API}/song/played/${songId}/${mood || 'neutral'}`, body, config);
        dispatch({ type: SONG_PLAYED, payload: res.data.songDetails });
    } catch (error) {
        console.log(error);
        dispatch({ type: SONG_PLAYED_FAIL });
    }
}

export const userSkipSong = (mood, songId, title, channelTitle, thumbnail) => async (dispatch) => {
    try {

        const body = JSON.stringify({ title, channelTitle, thumbnail })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put(`${API}/song/skipped/${songId}/${mood || 'neutral'}`, body, config);
        dispatch({ type: SONG_SKIPPED, payload: res.data.songDetails });
    } catch (error) {
        console.log(error);
        dispatch({ type: SONG_SKIPPED_FAIL });
    }
}

export const playlistCreated = (songs) => dispatch => {
    try {
        dispatch({ type: PLAYLIST_CREATED, payload: songs });
    } catch (error) {
        console.log(error);
    }
}

export const playlistCleared = () => dispatch => {
    try {
        dispatch({ type: PLAYLIST_CLEARED });
    } catch (error) {
        console.log(error);
    }
}

export const playlistUpdated = (songs) => dispatch => {
    try {
        const ytSongsArray = [];
        for (let song = 0; song < songs.length; song++) {
            const { snippet: { title, channelTitle, thumbnails } } = songs[song];
            const songObj = { title, channelTitle, thumbnail: thumbnails?.high?.url, songId: songs[song].id.videoId }
            ytSongsArray.push(songObj);
        }
        dispatch({ type: PLAYLIST_UPDATED, payload: ytSongsArray });
    } catch (error) {
        console.log(error);
    }
}

export const setCurrentSong = (song) => dispatch => {
    try {
        dispatch({ type: USER_SONG_PLAYED, payload: song });
    } catch (error) {
        console.log(error);
    }
}
export const closeCurrentSong = () => dispatch => {
    try {
        dispatch({ type: CLEAR_USER_PLAYING_SONGS });
    } catch (error) {
        console.log(error);
    }
}


export const newPlaylistCreated = (songs) => dispatch => {
    try {
        const ytSongsArray = [];
        for (let song = 0; song < songs.length; song++) {
            const { snippet: { title, channelTitle, thumbnails } } = songs[song];
            const songObj = { title, channelTitle, thumbnail: thumbnails?.high?.url, songId: songs[song].id.videoId }
            ytSongsArray.push(songObj);
        }
        dispatch({ type: PLAYLIST_CREATED, payload: ytSongsArray });
    } catch (error) {
        console.log(error);
    }
}