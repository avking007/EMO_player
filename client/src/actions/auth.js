import axios from 'axios';
import { AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, SIGNUP_FAIL, SIGNUP_SUCCESS, USER_LOADED } from '../reducers/types';
import { API } from '../utils/backend';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async(dispatch) => {

    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const user = await axios.get(`${API}/user`);
        dispatch({type: USER_LOADED, payload: user.data});
    } catch (error) {
        console.log(error);
        dispatch({type: AUTH_ERROR});
    }
}

export const login = (userDetails) => async(dispatch) => {
    try {
        const config = {
            'Content-Type': 'application/json'
        };

        const user = await axios.post(`${API}/user/login`, userDetails, config);
        dispatch({type: LOGIN_SUCCESS, payload: user.data});
        dispatch(loadUser());
    } catch (error) {
        console.log(error);
        dispatch({type: LOGIN_FAIL});
    }
};

export const signUp = (userDetails) => async(dispatch) => {
    try {
        const { email, password } = userDetails;
        const config = {
            'Content-Type': 'application/json'
        };
        const body = JSON.stringify({email, password});

        const user = await axios.post(`${API}/user/signup`, body, config);

        dispatch({type: SIGNUP_SUCCESS, payload: user.data});
        dispatch(loadUser());
    } catch (error) {
        dispatch({type: SIGNUP_FAIL });
        console.log(error);
    }
};
