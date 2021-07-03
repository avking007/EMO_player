import axios from 'axios';
import { SONG_PLAYED, SONG_PLAYED_FAIL, SONG_SKIPPED, SONG_SKIPPED_FAIL } from '../reducers/types';
import { API } from '../utils/backend';

export const userPlaySong = (mood, songId) => async(dispatch) => {
    try {
        const res = await axios.put(`${API}/song/played/${songId}/${mood || 'neutral'}`);
        dispatch({type: SONG_PLAYED, payload: res.data.songDetails});
    } catch (error) {
        console.log(error);
        dispatch({type: SONG_PLAYED_FAIL});
    }
}

export const userSkipSong = (mood, songId) => async(dispatch) => {
    try {
        const res = await axios.put(`${API}/song/skipped/${songId}/${mood || 'neutral'}`);
        dispatch({type: SONG_SKIPPED, payload: res.data.songDetails});
    } catch (error) {
        console.log(error);
        dispatch({type: SONG_SKIPPED_FAIL});
    }
}