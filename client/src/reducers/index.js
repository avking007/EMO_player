import {combineReducers} from 'redux';
import auth from './auth';
import song from './song';

export default combineReducers({
    auth,
    song,
})