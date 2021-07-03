import {
    SONG_PLAYED,
    SONG_PLAYED_FAIL,
    SONG_SKIPPED,
    SONG_SKIPPED_FAIL,
    USER_SONGS_LOADED,
    USER_SONGS_LOAD_FAIL
}
    from "./types";

const initState = {}

export default function songDetails(state = initState, dispatch) {

    const { type, payload } = dispatch;
    switch (type) {
        case USER_SONGS_LOADED:
        case SONG_PLAYED:
        case SONG_SKIPPED:
            console.log(payload);
            return {...payload};

        case USER_SONGS_LOAD_FAIL:
            return {};

        case SONG_PLAYED_FAIL:
        case SONG_SKIPPED_FAIL:
        default:
            return state;
    }
}