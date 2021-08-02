import axios from 'axios';
import { AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, SIGNUP_FAIL, SIGNUP_SUCCESS, USER_LOADED, USER_SONGS_LOADED } from '../reducers/types';
import setAuthToken from '../utils/setAuthToken';
import {set_alert} from './alert';

export const loadUser = () => async (dispatch) => {

    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const user = await axios.get(`/user`);
        const {_id, first_name, last_name, email } = user.data.user;
        const userData = {_id, first_name, last_name, email};

        dispatch({ type: USER_LOADED, payload: userData });
        dispatch({type: USER_SONGS_LOADED, payload: user.data.user.songDetails})
    } catch (error) {
        const err = error.response.data.errors;
        if (err) {
          err.forEach((error) => dispatch(set_alert(error.msg, 'danger')));
        }
        dispatch({ type: AUTH_ERROR });
    }
}

export const login = (userDetails) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const body = JSON.stringify(userDetails);
        const user = await axios.post(`/user/login`, body, config);

        dispatch({ type: LOGIN_SUCCESS, payload: user.data });
        dispatch(loadUser());
    } catch (error) {
        const err = error.response.data.errors;
        if (err) {
          err.forEach((error) => dispatch(set_alert(error.msg, 'danger')));
        }
        dispatch({ type: LOGIN_FAIL });
    }
};

export const signUp = (userDetails) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const body = JSON.stringify(userDetails);
        const user = await axios.post(`/user/signup`, body, config);

        dispatch({ type: SIGNUP_SUCCESS, payload: user.data });
        dispatch(loadUser());
    } catch (error) {
        const err = error.response.data.errors;
        if (err) {
          err.forEach((error) => dispatch(set_alert(error.msg, 'danger')));
        }
        dispatch({ type: SIGNUP_FAIL });
    }
};

export const logout = () => dispatch => {
    dispatch({type: LOGOUT_SUCCESS});
}