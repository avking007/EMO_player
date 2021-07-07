import {
    CLEAR_USER_PLAYING_SONGS,
    PLAYLIST_CLEARED,
    PLAYLIST_CREATED,
    PLAYLIST_UPDATED,
    SONG_PLAYED,
    SONG_PLAYED_FAIL,
    SONG_SKIPPED,
    SONG_SKIPPED_FAIL,
    USER_SONGS_LOADED,
    USER_SONGS_LOAD_FAIL,
    USER_SONG_PLAYED
}
    from "./types";

const initState = {
    songsArray: [],
    isLoading: true,
    currentMoodPlaylist: [],
    currentSong: null,
}

export default function songDetails(state = initState, dispatch) {

    const { type, payload } = dispatch;
    switch (type) {
        case USER_SONGS_LOADED:
        case SONG_PLAYED:
        case SONG_SKIPPED:
            return {...state, isLoading: false,songsArray: payload};

        case USER_SONGS_LOAD_FAIL:
            return {...state};
        
        case USER_SONG_PLAYED: 
            return {...state, currentSong: payload};
        
        case CLEAR_USER_PLAYING_SONGS: 
            return {...state, currentSong: null}
        
        case PLAYLIST_CREATED:
            return {...state, currentMoodPlaylist: payload};
        
        case PLAYLIST_UPDATED:
            const _currentPlaylist = state.currentMoodPlaylist; 
            return {...state, currentMoodPlaylist:[..._currentPlaylist, ...payload]};

        case PLAYLIST_CLEARED: 
            return {...state, currentMoodPlaylist: []};
        case SONG_PLAYED_FAIL:
        case SONG_SKIPPED_FAIL:
        default:
            return state;
    }
}