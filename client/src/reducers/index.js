import {combineReducers} from 'redux';
import auth from './auth';
import song from './song';
import alert from './alert';

export default combineReducers({
    auth,
    song,
    alert,
})